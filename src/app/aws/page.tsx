"use client";

import { useEffect, useRef, useState } from "react";
import FluidCallButton from "@/components/aws/FluidCallButton";
import FluidOverlay from "@/components/aws/FluidOverlay";
import { S3CreateWizard, RDSCreateWizard, defaultS3, defaultRDS } from "@/components/aws/CreateWizards";
import type { S3WizardState, RDSWizardState } from "@/components/aws/CreateWizards";
import {
  Server, Database, Globe, Shield, Bell, Settings,
  ChevronDown, Search, Plus, RefreshCw, Filter, HardDrive,
} from "lucide-react";

// ── data ────────────────────────────────────────────────────────────────────

const services = [
  { icon: Server,    label: "EC2" },
  { icon: Database,  label: "RDS" },
  { icon: Globe,     label: "S3" },
  { icon: Shield,    label: "IAM" },
  { icon: Globe,     label: "CloudFront" },
  { icon: Database,  label: "DynamoDB" },
  { icon: HardDrive, label: "Lambda" },
];

const VALID_SERVICES = services.map(s => s.label);

const ec2Instances = [
  { id: "i-0abc123def456", name: "web-server-prod",  type: "t3.medium", state: "running", az: "us-east-1a", ip: "54.210.12.33" },
  { id: "i-0def789abc012", name: "api-server-prod",  type: "t3.large",  state: "running", az: "us-east-1b", ip: "52.86.44.12" },
  { id: "i-0ghi345jkl678", name: "worker-staging",   type: "t2.micro",  state: "stopped", az: "us-east-1c", ip: "—" },
  { id: "i-0mno901pqr234", name: "db-proxy",          type: "t3.small",  state: "running", az: "us-east-1a", ip: "34.201.88.55" },
];

const rdsDatabases = [
  { id: "prod-postgres-01", engine: "PostgreSQL 15.3", type: "db.t3.medium", status: "available",  az: "us-east-1a", storage: "100 GiB" },
  { id: "staging-mysql",    engine: "MySQL 8.0.33",    type: "db.t3.small",  status: "available",  az: "us-east-1b", storage: "20 GiB" },
  { id: "analytics-aurora", engine: "Aurora MySQL",    type: "db.r6g.large", status: "backing-up", az: "Multi-AZ",   storage: "500 GiB" },
];

const s3Buckets = [
  { name: "my-app-assets-prod",    region: "us-east-1", objects: "14,203", size: "8.4 GB",  access: "Private" },
  { name: "backup-archive-2024",   region: "us-west-2", objects: "891",    size: "234 GB",  access: "Private" },
  { name: "public-static-content", region: "us-east-1", objects: "3,102",  size: "1.2 GB",  access: "Public" },
  { name: "logs-cloudtrail",       region: "us-east-1", objects: "98,441", size: "45 GB",   access: "Private" },
];

const iamUsers = [
  { name: "admin-het",      groups: "Administrators",       mfa: true,  lastActive: "Today" },
  { name: "deploy-bot",     groups: "DeployGroup",          mfa: false, lastActive: "1 hour ago" },
  { name: "readonly-audit", groups: "ReadOnlyAccess",       mfa: true,  lastActive: "3 days ago" },
  { name: "dev-sarah",      groups: "Developers, S3Access", mfa: true,  lastActive: "Yesterday" },
];

const lambdaFunctions = [
  { name: "auth-token-validator", runtime: "Node.js 20.x", memory: "128 MB", timeout: "3s",  invocations: "24,891", errors: "0.01%" },
  { name: "image-resizer",        runtime: "Python 3.12",  memory: "512 MB", timeout: "30s", invocations: "8,234",  errors: "0%" },
  { name: "webhook-processor",    runtime: "Node.js 20.x", memory: "256 MB", timeout: "15s", invocations: "1,203",  errors: "0.4%" },
  { name: "scheduled-cleanup",    runtime: "Python 3.12",  memory: "128 MB", timeout: "60s", invocations: "24",     errors: "0%" },
];

const dynamoTables = [
  { name: "users",         status: "Active", items: "102,341", size: "184 MB", rcu: "25",  wcu: "25" },
  { name: "sessions",      status: "Active", items: "8,912",   size: "12 MB",  rcu: "5",   wcu: "5" },
  { name: "audit-log",     status: "Active", items: "1.2M",    size: "2.4 GB", rcu: "100", wcu: "50" },
  { name: "feature-flags", status: "Active", items: "38",      size: "0.1 MB", rcu: "1",   wcu: "1" },
];

const cfDistributions = [
  { id: "E1AB2CD3EF4GH5", domain: "d1xyz.cloudfront.net", origin: "my-app-assets-prod.s3.amazonaws.com", status: "Deployed", price: "100" },
  { id: "E6IJ7KL8MN9OP0", domain: "d2abc.cloudfront.net", origin: "api.myapp.com",                       status: "Deployed", price: "200" },
];

// ── service views ────────────────────────────────────────────────────────────

function EC2View() {
  const [sel, setSel] = useState<string[]>([]);
  const toggle = (id: string) => setSel(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  return (
    <div id="aws-content" className="p-6">
      <div className="text-white/40 text-xs mb-4">EC2 › <span className="text-white/70">Instances</span></div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white">Instances</h1>
          <p className="text-white/40 text-xs mt-0.5">Manage your EC2 instances</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded text-white/70 text-xs"><RefreshCw size={12} />Refresh</button>
          <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded text-white/70 text-xs"><Filter size={12} />Filter</button>
          <button id="aws-launch-btn" className="flex items-center gap-2 bg-[#FF9900] hover:bg-[#EC7211] px-3 py-1.5 rounded text-white text-xs font-semibold">
            <Plus size={12} />Launch Instance
          </button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[{l:"Running",v:"3",c:"text-green-400"},{l:"Stopped",v:"1",c:"text-red-400"},{l:"vCPUs",v:"12",c:"text-white"},{l:"Memory",v:"48 GiB",c:"text-white"}].map(s=>(
          <div key={s.l} className="bg-[#161e2d] border border-white/10 rounded-lg p-4">
            <div className="text-white/40 text-xs mb-1">{s.l}</div>
            <div className={`text-2xl font-semibold ${s.c}`}>{s.v}</div>
          </div>
        ))}
      </div>
      <div id="aws-instances-table" className="bg-[#161e2d] border border-white/10 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10 text-white/70 text-xs font-medium">
          Instances ({ec2Instances.length}){sel.length > 0 && <span className="ml-2 bg-[#FF9900]/20 text-[#FF9900] px-2 py-0.5 rounded">{sel.length} selected</span>}
        </div>
        <table className="w-full">
          <thead><tr className="border-b border-white/5">{["","Name","ID","Type","State","AZ","IP"].map(h=><th key={h} className="px-4 py-2 text-left text-white/40 text-xs font-medium">{h}</th>)}</tr></thead>
          <tbody>
            {ec2Instances.map(i=>(
              <tr key={i.id} onClick={()=>toggle(i.id)} className={`border-b border-white/5 cursor-pointer transition-colors ${sel.includes(i.id)?"bg-[#FF9900]/5":"hover:bg-white/[0.02]"}`}>
                <td className="px-4 py-3"><input type="checkbox" checked={sel.includes(i.id)} onChange={()=>toggle(i.id)} className="accent-[#FF9900]" /></td>
                <td className="px-4 py-3 text-white text-xs font-medium">{i.name}</td>
                <td className="px-4 py-3 text-[#4a9eed] text-xs">{i.id}</td>
                <td className="px-4 py-3 text-white/60 text-xs">{i.type}</td>
                <td className="px-4 py-3"><span className={`flex items-center gap-1.5 text-xs ${i.state==="running"?"text-green-400":"text-red-400"}`}><span className={`w-1.5 h-1.5 rounded-full ${i.state==="running"?"bg-green-400":"bg-red-400"}`}/>{i.state}</span></td>
                <td className="px-4 py-3 text-white/60 text-xs">{i.az}</td>
                <td className="px-4 py-3 text-white/60 text-xs">{i.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RDSView({ onOpenWizard }: { onOpenWizard: () => void }) {
  return (
    <div id="aws-content" className="p-6">
      <div className="text-white/40 text-xs mb-4">RDS › <span className="text-white/70">Databases</span></div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white">Databases</h1>
          <p className="text-white/40 text-xs mt-0.5">Managed relational database service</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded text-white/70 text-xs"><RefreshCw size={12}/>Refresh</button>
          <button id="rds-create-btn" onClick={onOpenWizard} className="flex items-center gap-2 bg-[#FF9900] hover:bg-[#EC7211] px-3 py-1.5 rounded text-white text-xs font-semibold">
            <Plus size={12}/>Create database
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[{l:"Total DBs",v:"3"},{l:"Available",v:"2"},{l:"Backing up",v:"1"}].map(s=>(
          <div key={s.l} className="bg-[#161e2d] border border-white/10 rounded-lg p-4">
            <div className="text-white/40 text-xs mb-1">{s.l}</div>
            <div className="text-2xl font-semibold text-white">{s.v}</div>
          </div>
        ))}
      </div>
      <div id="rds-table" className="bg-[#161e2d] border border-white/10 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10 text-white/70 text-xs font-medium">DB Instances ({rdsDatabases.length})</div>
        <table className="w-full">
          <thead><tr className="border-b border-white/5">{["DB identifier","Engine","Class","Status","AZ","Storage"].map(h=><th key={h} className="px-4 py-2 text-left text-white/40 text-xs font-medium">{h}</th>)}</tr></thead>
          <tbody>
            {rdsDatabases.map(db=>(
              <tr key={db.id} className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer">
                <td className="px-4 py-3 text-[#4a9eed] text-xs font-medium">{db.id}</td>
                <td className="px-4 py-3 text-white/70 text-xs">{db.engine}</td>
                <td className="px-4 py-3 text-white/60 text-xs">{db.type}</td>
                <td className="px-4 py-3"><span className={`text-xs ${db.status==="available"?"text-green-400":"text-yellow-400"}`}>{db.status}</span></td>
                <td className="px-4 py-3 text-white/60 text-xs">{db.az}</td>
                <td className="px-4 py-3 text-white/60 text-xs">{db.storage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function S3View({ onOpenWizard }: { onOpenWizard: () => void }) {
  return (
    <div id="aws-content" className="p-6">
      <div className="text-white/40 text-xs mb-4">S3 › <span className="text-white/70">Buckets</span></div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white">Buckets</h1>
          <p className="text-white/40 text-xs mt-0.5">Simple, durable object storage</p>
        </div>
        <button id="s3-create-btn" onClick={onOpenWizard} className="flex items-center gap-2 bg-[#FF9900] hover:bg-[#EC7211] px-3 py-1.5 rounded text-white text-xs font-semibold">
          <Plus size={12}/>Create bucket
        </button>
      </div>
      <div id="s3-table" className="bg-[#161e2d] border border-white/10 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10 text-white/70 text-xs font-medium">Buckets ({s3Buckets.length})</div>
        <table className="w-full">
          <thead><tr className="border-b border-white/5">{["Name","Region","Objects","Size","Access"].map(h=><th key={h} className="px-4 py-2 text-left text-white/40 text-xs font-medium">{h}</th>)}</tr></thead>
          <tbody>
            {s3Buckets.map(b=>(
              <tr key={b.name} className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer">
                <td className="px-4 py-3 text-[#4a9eed] text-xs font-medium">{b.name}</td>
                <td className="px-4 py-3 text-white/60 text-xs">{b.region}</td>
                <td className="px-4 py-3 text-white/60 text-xs">{b.objects}</td>
                <td className="px-4 py-3 text-white/60 text-xs">{b.size}</td>
                <td className="px-4 py-3"><span className={`text-xs ${b.access==="Public"?"text-yellow-400":"text-white/40"}`}>{b.access}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function IAMView() {
  return (
    <div id="aws-content" className="p-6">
      <div className="text-white/40 text-xs mb-4">IAM › <span className="text-white/70">Users</span></div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white">Users</h1>
          <p className="text-white/40 text-xs mt-0.5">Manage AWS users and access</p>
        </div>
        <button id="iam-create-user-btn" className="flex items-center gap-2 bg-[#FF9900] hover:bg-[#EC7211] px-3 py-1.5 rounded text-white text-xs font-semibold">
          <Plus size={12}/>Create user
        </button>
      </div>
      <div className="flex gap-3 mb-6">
        {[{l:"Users",v:"4"},{l:"Groups",v:"5"},{l:"Roles",v:"12"},{l:"Policies",v:"18"}].map(s=>(
          <div key={s.l} className="bg-[#161e2d] border border-white/10 rounded-lg p-4 flex-1">
            <div className="text-white/40 text-xs mb-1">{s.l}</div>
            <div className="text-2xl font-semibold text-white">{s.v}</div>
          </div>
        ))}
      </div>
      <div id="iam-users-table" className="bg-[#161e2d] border border-white/10 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10 text-white/70 text-xs font-medium">Users ({iamUsers.length})</div>
        <table className="w-full">
          <thead><tr className="border-b border-white/5">{["Username","Groups","MFA","Last active"].map(h=><th key={h} className="px-4 py-2 text-left text-white/40 text-xs font-medium">{h}</th>)}</tr></thead>
          <tbody>
            {iamUsers.map(u=>(
              <tr key={u.name} className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer">
                <td className="px-4 py-3 text-[#4a9eed] text-xs font-medium">{u.name}</td>
                <td className="px-4 py-3 text-white/60 text-xs">{u.groups}</td>
                <td className="px-4 py-3"><span className={`text-xs ${u.mfa?"text-green-400":"text-red-400"}`}>{u.mfa?"Enabled":"Disabled"}</span></td>
                <td className="px-4 py-3 text-white/60 text-xs">{u.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LambdaView() {
  return (
    <div id="aws-content" className="p-6">
      <div className="text-white/40 text-xs mb-4">Lambda › <span className="text-white/70">Functions</span></div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white">Functions</h1>
          <p className="text-white/40 text-xs mt-0.5">Run code without managing servers</p>
        </div>
        <button id="lambda-create-btn" className="flex items-center gap-2 bg-[#FF9900] hover:bg-[#EC7211] px-3 py-1.5 rounded text-white text-xs font-semibold">
          <Plus size={12}/>Create function
        </button>
      </div>
      <div id="lambda-table" className="bg-[#161e2d] border border-white/10 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10 text-white/70 text-xs font-medium">Functions ({lambdaFunctions.length})</div>
        <table className="w-full">
          <thead><tr className="border-b border-white/5">{["Function name","Runtime","Memory","Timeout","Invocations","Error rate"].map(h=><th key={h} className="px-4 py-2 text-left text-white/40 text-xs font-medium">{h}</th>)}</tr></thead>
          <tbody>
            {lambdaFunctions.map(f=>(
              <tr key={f.name} className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer">
                <td className="px-4 py-3 text-[#4a9eed] text-xs font-medium">{f.name}</td>
                <td className="px-4 py-3 text-white/60 text-xs">{f.runtime}</td>
                <td className="px-4 py-3 text-white/60 text-xs">{f.memory}</td>
                <td className="px-4 py-3 text-white/60 text-xs">{f.timeout}</td>
                <td className="px-4 py-3 text-white/60 text-xs">{f.invocations}</td>
                <td className="px-4 py-3"><span className={`text-xs ${parseFloat(f.errors)>0?"text-yellow-400":"text-green-400"}`}>{f.errors}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DynamoView() {
  return (
    <div id="aws-content" className="p-6">
      <div className="text-white/40 text-xs mb-4">DynamoDB › <span className="text-white/70">Tables</span></div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white">Tables</h1>
          <p className="text-white/40 text-xs mt-0.5">Fast, flexible NoSQL database</p>
        </div>
        <button id="dynamo-create-btn" className="flex items-center gap-2 bg-[#FF9900] hover:bg-[#EC7211] px-3 py-1.5 rounded text-white text-xs font-semibold">
          <Plus size={12}/>Create table
        </button>
      </div>
      <div id="dynamo-table" className="bg-[#161e2d] border border-white/10 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10 text-white/70 text-xs font-medium">Tables ({dynamoTables.length})</div>
        <table className="w-full">
          <thead><tr className="border-b border-white/5">{["Table name","Status","Items","Size","RCU","WCU"].map(h=><th key={h} className="px-4 py-2 text-left text-white/40 text-xs font-medium">{h}</th>)}</tr></thead>
          <tbody>
            {dynamoTables.map(t=>(
              <tr key={t.name} className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer">
                <td className="px-4 py-3 text-[#4a9eed] text-xs font-medium">{t.name}</td>
                <td className="px-4 py-3 text-green-400 text-xs">{t.status}</td>
                <td className="px-4 py-3 text-white/60 text-xs">{t.items}</td>
                <td className="px-4 py-3 text-white/60 text-xs">{t.size}</td>
                <td className="px-4 py-3 text-white/60 text-xs">{t.rcu}</td>
                <td className="px-4 py-3 text-white/60 text-xs">{t.wcu}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CloudFrontView() {
  return (
    <div id="aws-content" className="p-6">
      <div className="text-white/40 text-xs mb-4">CloudFront › <span className="text-white/70">Distributions</span></div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white">Distributions</h1>
          <p className="text-white/40 text-xs mt-0.5">Global content delivery network</p>
        </div>
        <button id="cf-create-btn" className="flex items-center gap-2 bg-[#FF9900] hover:bg-[#EC7211] px-3 py-1.5 rounded text-white text-xs font-semibold">
          <Plus size={12}/>Create distribution
        </button>
      </div>
      <div id="cf-table" className="bg-[#161e2d] border border-white/10 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10 text-white/70 text-xs font-medium">Distributions ({cfDistributions.length})</div>
        <table className="w-full">
          <thead><tr className="border-b border-white/5">{["ID","Domain","Origin","Status","Price class"].map(h=><th key={h} className="px-4 py-2 text-left text-white/40 text-xs font-medium">{h}</th>)}</tr></thead>
          <tbody>
            {cfDistributions.map(d=>(
              <tr key={d.id} className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer">
                <td className="px-4 py-3 text-[#4a9eed] text-xs font-medium">{d.id}</td>
                <td className="px-4 py-3 text-white/70 text-xs">{d.domain}</td>
                <td className="px-4 py-3 text-white/60 text-xs">{d.origin}</td>
                <td className="px-4 py-3 text-green-400 text-xs">{d.status}</td>
                <td className="px-4 py-3 text-white/60 text-xs">Price Class {d.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function renderServiceView(service: string, onOpenS3: () => void, onOpenRDS: () => void) {
  switch (service) {
    case "EC2":        return <EC2View />;
    case "RDS":        return <RDSView onOpenWizard={onOpenRDS} />;
    case "S3":         return <S3View onOpenWizard={onOpenS3} />;
    case "IAM":        return <IAMView />;
    case "Lambda":     return <LambdaView />;
    case "DynamoDB":   return <DynamoView />;
    case "CloudFront": return <CloudFrontView />;
    default:           return <EC2View />;
  }
}

// ── page ─────────────────────────────────────────────────────────────────────

export default function AWSPage() {
  const [activeService, setActiveService] = useState("EC2");
  const [openWizard, setOpenWizard]       = useState<"s3" | "rds" | null>(null);
  const [s3Step, setS3Step]               = useState(0);
  const [s3Data, setS3Data]               = useState<S3WizardState>(defaultS3);
  const [rdsStep, setRdsStep]             = useState(0);
  const [rdsData, setRdsData]             = useState<RDSWizardState>(defaultRDS);

  // Stable ref so wizard controls can read current wizard without stale closure
  const openWizardRef = useRef<"s3" | "rds" | null>(null);
  useEffect(() => { openWizardRef.current = openWizard; }, [openWizard]);

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__fluid = {
      // ── Navigation ──────────────────────────────────────────────────────
      navigate: (service: string) => {
        const match = VALID_SERVICES.find(s => s.toLowerCase() === service.toLowerCase()) ?? service;
        setActiveService(match);
        document.querySelectorAll(".aws-service-item").forEach(el => {
          const btn = el as HTMLElement;
          const isMatch = btn.textContent?.trim().toLowerCase() === match.toLowerCase();
          btn.style.color      = isMatch ? "#FF9900" : "";
          btn.style.background = isMatch ? "rgba(255,153,0,0.1)" : "";
          btn.style.borderRight = isMatch ? "2px solid #FF9900" : "";
        });
      },
      // ── Highlight ───────────────────────────────────────────────────────
      highlight: (selector: string, msg?: string) => {
        const el = document.querySelector(selector) as HTMLElement | null;
        if (!el) return;
        const prev = el.style.outline;
        el.style.outline = "3px solid #FF9900";
        el.style.outlineOffset = "3px";
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        if (msg) {
          const existing = document.getElementById("__fluid_tip__");
          if (existing) existing.remove();
          const tip = document.createElement("div");
          tip.id = "__fluid_tip__";
          tip.style.cssText = "position:fixed;bottom:100px;left:40%;transform:translateX(-50%);background:#FF9900;color:#000;padding:10px 18px;border-radius:12px;font-size:13px;font-weight:600;z-index:99999;pointer-events:none;max-width:320px;text-align:center;";
          tip.textContent = msg;
          document.body.appendChild(tip);
          setTimeout(() => { el.style.outline = prev; tip.remove(); }, 5000);
        } else {
          setTimeout(() => { el.style.outline = prev; }, 3000);
        }
      },
      // ── Persistent CSS injection (survives React re-renders) ────────────
      css: (rules: string) => {
        let s = document.getElementById("__fluid_live__") as HTMLStyleElement | null;
        if (!s) {
          s = document.createElement("style");
          s.id = "__fluid_live__";
          document.head.appendChild(s);
        }
        s.textContent += "\n" + rules;
      },
      // ── Reset ───────────────────────────────────────────────────────────
      resetUI: () => {
        // Remove the persistent stylesheet
        document.getElementById("__fluid_live__")?.remove();
        // Also strip any leftover inline styles
        ["#aws-root","#aws-topbar","#aws-sidebar","#aws-body","#aws-main","#aws-content"].forEach(sel => {
          (document.querySelector(sel) as HTMLElement | null)?.removeAttribute("style");
        });
        document.querySelectorAll(".aws-service-item, #aws-main button, #aws-main table").forEach(el => {
          (el as HTMLElement).removeAttribute("style");
        });
      },
      // ── Wizard controls ─────────────────────────────────────────────────
      wizardOpen:  (type: string) => setOpenWizard(type as "s3" | "rds"),
      wizardClose: () => setOpenWizard(null),
      wizardNext:  () => {
        const w = openWizardRef.current;
        if (w === "s3")  setS3Step(p => Math.min(3, p + 1));
        if (w === "rds") setRdsStep(p => Math.min(3, p + 1));
      },
      wizardBack:  () => {
        const w = openWizardRef.current;
        if (w === "s3")  setS3Step(p => Math.max(0, p - 1));
        if (w === "rds") setRdsStep(p => Math.max(0, p - 1));
      },
      wizardStep:  (n: number) => {
        const w = openWizardRef.current;
        if (w === "s3")  setS3Step(n);
        if (w === "rds") setRdsStep(n);
      },
    };
  }, []);

  const closeS3  = () => { setOpenWizard(null); setS3Step(0);  setS3Data(defaultS3); };
  const closeRDS = () => { setOpenWizard(null); setRdsStep(0); setRdsData(defaultRDS); };

  return (
    <div id="aws-root" className="min-h-screen bg-[#0f1923] text-white flex flex-col text-sm">
      {/* Top bar */}
      <header id="aws-topbar" className="bg-[#161e2d] border-b border-white/10 px-4 h-12 flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-2 mr-4">
          <div className="text-[#FF9900] font-bold text-lg">aws</div>
          <span className="text-white/20">|</span>
          <span className="text-white/60 text-xs">Console Home</span>
        </div>
        <div className="flex items-center gap-1 bg-white/5 rounded px-3 py-1 flex-1 max-w-sm">
          <Search size={14} className="text-white/40" />
          <input placeholder="Search services, features, docs" className="bg-transparent text-xs text-white/60 outline-none placeholder-white/30 flex-1 ml-2" />
        </div>
        <div className="ml-auto flex items-center gap-4 text-white/60 text-xs">
          <span className="flex items-center gap-1">US East (N. Virginia) <ChevronDown size={12} /></span>
          <Bell size={16} />
          <Settings size={16} />
          <span className="flex items-center gap-1 bg-[#FF9900]/20 text-[#FF9900] px-2 py-1 rounded">
            demo-account <ChevronDown size={12} />
          </span>
        </div>
      </header>

      <div id="aws-body" className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside id="aws-sidebar" className="w-52 bg-[#161e2d] border-r border-white/10 flex flex-col shrink-0">
          <div className="px-4 py-3 border-b border-white/10">
            <div className="text-[#FF9900] font-semibold text-xs uppercase tracking-wider">Services</div>
          </div>
          <nav className="flex-1 py-2">
            {services.map(({ icon: Icon, label }) => (
              <button
                key={label}
                onClick={() => setActiveService(label)}
                data-service={label}
                className={`aws-service-item w-full flex items-center gap-3 px-4 py-2.5 text-xs transition-colors ${
                  activeService === label
                    ? "bg-[#FF9900]/10 text-[#FF9900] border-r-2 border-[#FF9900]"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main id="aws-main" className="flex-1 overflow-auto bg-[#0f1923]">
          {renderServiceView(activeService, () => setOpenWizard("s3"), () => setOpenWizard("rds"))}
        </main>
      </div>

      {/* Wizards */}
      {openWizard === "s3" && (
        <S3CreateWizard
          step={s3Step}
          data={s3Data}
          onStep={setS3Step}
          onData={patch => setS3Data(p => ({ ...p, ...patch }))}
          onClose={closeS3}
        />
      )}
      {openWizard === "rds" && (
        <RDSCreateWizard
          step={rdsStep}
          data={rdsData}
          onStep={setRdsStep}
          onData={patch => setRdsData(p => ({ ...p, ...patch }))}
          onClose={closeRDS}
        />
      )}

      <FluidCallButton />
      <FluidOverlay />
    </div>
  );
}
