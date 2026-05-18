"use client";

import { X, ChevronRight, HelpCircle, AlertTriangle, Info } from "lucide-react";

// ── shared ────────────────────────────────────────────────────────────────

function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
              i < current  ? "bg-[#FF9900] border-[#FF9900] text-black"
            : i === current ? "border-[#FF9900] text-[#FF9900] bg-transparent"
            : "border-white/20 text-white/30"
            }`}>{i < current ? "✓" : i + 1}</div>
            <span className={`text-[9px] mt-1 whitespace-nowrap ${i === current ? "text-[#FF9900]" : "text-white/30"}`}>{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-12 h-px mx-1 mb-4 ${i < current ? "bg-[#FF9900]" : "bg-white/10"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function Tip({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 bg-[#1a2030] border border-blue-500/20 rounded-lg p-3 mt-2">
      <Info size={12} className="text-blue-400 mt-0.5 shrink-0" />
      <p className="text-blue-300/70 text-xs leading-relaxed">{text}</p>
    </div>
  );
}

function Warning({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 bg-yellow-900/20 border border-yellow-500/20 rounded-lg p-3 mt-2">
      <AlertTriangle size={12} className="text-yellow-400 mt-0.5 shrink-0" />
      <p className="text-yellow-300/70 text-xs leading-relaxed">{text}</p>
    </div>
  );
}

function Radio({ id, label, desc, checked, onChange }: { id: string; label: string; desc?: string; checked: boolean; onChange: () => void }) {
  return (
    <label id={id} onClick={onChange} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${checked ? "border-[#FF9900]/50 bg-[#FF9900]/5" : "border-white/10 bg-white/[0.02] hover:border-white/20"}`}>
      <div className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${checked ? "border-[#FF9900]" : "border-white/30"}`}>
        {checked && <div className="w-2 h-2 rounded-full bg-[#FF9900]" />}
      </div>
      <div>
        <div className="text-white text-xs font-medium">{label}</div>
        {desc && <div className="text-white/40 text-xs mt-0.5 leading-relaxed">{desc}</div>}
      </div>
    </label>
  );
}

function Checkbox({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: () => void }) {
  return (
    <label id={id} onClick={onChange} className="flex items-start gap-3 p-2.5 rounded cursor-pointer hover:bg-white/[0.02] group">
      <div className={`w-4 h-4 rounded border-2 mt-0.5 shrink-0 flex items-center justify-center transition-all ${checked ? "border-[#FF9900] bg-[#FF9900]" : "border-white/30 group-hover:border-white/50"}`}>
        {checked && <span className="text-black text-[10px] font-bold">✓</span>}
      </div>
      <span className="text-white/70 text-xs leading-relaxed">{label}</span>
    </label>
  );
}

function WizardShell({ title, service, step, steps, onClose, onNext, onBack, nextLabel, children }: {
  title: string; service: string; step: number; steps: string[];
  onClose: () => void; onNext: () => void; onBack: () => void;
  nextLabel?: string; children: React.ReactNode;
}) {
  const isLast = step === steps.length - 1;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0d1117] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
          <div>
            <div className="text-white/40 text-xs mb-0.5">{service}</div>
            <h2 className="text-white font-semibold text-base">{title}</h2>
          </div>
          <button id="wizard-close-btn" onClick={onClose} className="text-white/30 hover:text-white"><X size={18} /></button>
        </div>
        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <Stepper steps={steps} current={step} />
          {children}
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 shrink-0">
          <button id="wizard-back-btn" onClick={onBack} disabled={step === 0} className="text-white/40 hover:text-white text-xs disabled:opacity-30 disabled:cursor-not-allowed transition-colors">← Back</button>
          <div className="flex items-center gap-2 text-white/30 text-xs">Step {step + 1} of {steps.length}</div>
          <button id="wizard-next-btn" onClick={onNext} className="flex items-center gap-2 bg-[#FF9900] hover:bg-[#EC7211] px-5 py-2 rounded-lg text-black text-xs font-semibold transition-colors">
            {isLast ? "Create bucket" : nextLabel ?? "Next"} <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── S3 Create Bucket Wizard ───────────────────────────────────────────────

interface S3WizardState {
  name: string; region: string;
  acl: "disabled" | "enabled"; aclMode: "preferred" | "writer";
  blockAll: boolean; blockNewAcl: boolean; blockAnyAcl: boolean; blockNewPolicy: boolean; blockCrossAccount: boolean;
  versioning: "disabled" | "enabled";
  encryptType: "sse-s3" | "sse-kms" | "dsse-kms";
  bucketKey: boolean; objectLock: boolean;
}

const defaultS3: S3WizardState = {
  name: "", region: "us-east-1",
  acl: "disabled", aclMode: "preferred",
  blockAll: true, blockNewAcl: true, blockAnyAcl: true, blockNewPolicy: true, blockCrossAccount: true,
  versioning: "disabled",
  encryptType: "sse-s3", bucketKey: true, objectLock: false,
};

const S3_STEPS = ["General config", "Object Ownership", "Public Access", "Encryption & Versioning"];

export function S3CreateWizard({ step, data, onStep, onData, onClose }: {
  step: number; data: S3WizardState; onStep: (n: number) => void;
  onData: (patch: Partial<S3WizardState>) => void; onClose: () => void;
}) {
  return (
    <WizardShell title="Create bucket" service="Amazon S3" step={step} steps={S3_STEPS}
      onClose={onClose} onBack={() => onStep(Math.max(0, step - 1))} onNext={() => onStep(Math.min(S3_STEPS.length - 1, step + 1))}>

      {step === 0 && (
        <div className="space-y-4">
          <div>
            <label className="text-white/60 text-xs font-medium block mb-1.5">Bucket name <span className="text-red-400">*</span></label>
            <input id="s3-bucket-name-input" value={data.name} onChange={e => onData({ name: e.target.value })}
              placeholder="my-unique-bucket-name"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder-white/20 focus:outline-none focus:border-[#FF9900]" />
            <p className="text-white/30 text-xs mt-1">Must be globally unique, 3–63 chars, lowercase, no underscores</p>
          </div>
          <div>
            <label className="text-white/60 text-xs font-medium block mb-1.5">AWS Region</label>
            <select id="s3-region-select" value={data.region} onChange={e => onData({ region: e.target.value })}
              className="w-full bg-[#161e2d] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#FF9900]">
              {["us-east-1","us-east-2","us-west-1","us-west-2","eu-west-1","eu-central-1","ap-southeast-1"].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-white/60 text-xs font-medium block mb-1.5">Copy settings from existing bucket <span className="text-white/30">(optional)</span></label>
            <select className="w-full bg-[#161e2d] border border-white/10 rounded-lg px-3 py-2 text-white/40 text-xs focus:outline-none">
              <option>Don't copy</option>
            </select>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-white font-medium text-sm">Object Ownership</h3>
            <HelpCircle size={13} className="text-white/30" />
          </div>
          <p className="text-white/40 text-xs leading-relaxed">Object Ownership controls ownership of objects uploaded to your bucket and the use of access control lists (ACLs). Object ownership determines who can specify access to objects.</p>

          <div id="s3-acl-option" className="space-y-2">
            <Radio id="s3-acl-disabled" label="ACLs disabled (recommended)" checked={data.acl === "disabled"} onChange={() => onData({ acl: "disabled" })}
              desc="All objects in this bucket are owned by this account. Access to this bucket and its objects is specified using only policies." />
            <Radio id="s3-acl-enabled" label="ACLs enabled" checked={data.acl === "enabled"} onChange={() => onData({ acl: "enabled" })}
              desc="Objects in this bucket can be owned by other AWS accounts. Access to this bucket and its objects can be specified using ACLs." />
          </div>

          {data.acl === "enabled" && (
            <div id="s3-acl-mode-option" className="pl-4 space-y-2 border-l-2 border-white/10">
              <p className="text-white/40 text-xs font-medium">Object Ownership</p>
              <Radio id="s3-acl-preferred" label="Bucket owner preferred" checked={data.aclMode === "preferred"} onChange={() => onData({ aclMode: "preferred" })}
                desc="If a new object is uploaded with the bucket-owner-full-control canned ACL, the bucket owner has full control." />
              <Radio id="s3-acl-writer" label="Object writer" checked={data.aclMode === "writer"} onChange={() => onData({ aclMode: "writer" })}
                desc="The object writer remains the object owner." />
            </div>
          )}
          <Tip text="If you want to share objects publicly or with other AWS accounts, enable ACLs. For most use cases, keep ACLs disabled — it's simpler and more secure." />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-white font-medium text-sm">Block Public Access settings for this bucket</h3>
          </div>
          <Warning text="Turning off block public access settings might result in this bucket and the objects that it contains becoming public." />

          <div id="s3-block-all-option" className="mt-3">
            <Checkbox id="s3-block-all" label="Block all public access" checked={data.blockAll}
              onChange={() => onData({ blockAll: !data.blockAll, blockNewAcl: !data.blockAll, blockAnyAcl: !data.blockAll, blockNewPolicy: !data.blockAll, blockCrossAccount: !data.blockAll })} />
          </div>

          <div id="s3-individual-options" className="pl-4 space-y-1 border-l-2 border-white/10">
            <Checkbox id="s3-block-new-acl" label="Block public access to buckets and objects granted through new access control lists (ACLs)" checked={data.blockNewAcl} onChange={() => onData({ blockNewAcl: !data.blockNewAcl })} />
            <Checkbox id="s3-block-any-acl" label="Block public access to buckets and objects granted through any access control lists (ACLs)" checked={data.blockAnyAcl} onChange={() => onData({ blockAnyAcl: !data.blockAnyAcl })} />
            <Checkbox id="s3-block-new-policy" label="Block public access to buckets and objects granted through new public bucket or access point policies" checked={data.blockNewPolicy} onChange={() => onData({ blockNewPolicy: !data.blockNewPolicy })} />
            <Checkbox id="s3-block-cross-account" label="Block public and cross-account access to buckets and objects through any public bucket or access point policies" checked={data.blockCrossAccount} onChange={() => onData({ blockCrossAccount: !data.blockCrossAccount })} />
          </div>
          <Tip text="For private buckets, keep 'Block all public access' checked. Only uncheck if you're hosting a static website or need public file access." />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <div>
            <h3 className="text-white font-medium text-sm mb-3">Bucket Versioning</h3>
            <div id="s3-versioning-option" className="space-y-2">
              <Radio id="s3-versioning-disabled" label="Disable" checked={data.versioning === "disabled"} onChange={() => onData({ versioning: "disabled" })} />
              <Radio id="s3-versioning-enabled" label="Enable" checked={data.versioning === "enabled"} onChange={() => onData({ versioning: "enabled" })}
                desc="Versioning keeps multiple variants of an object. Once enabled, it can be suspended but not fully disabled." />
            </div>
          </div>

          <div>
            <h3 className="text-white font-medium text-sm mb-1">Default encryption</h3>
            <p className="text-white/40 text-xs mb-3">Server-side encryption is automatically applied to new objects stored in this bucket.</p>
            <div id="s3-encrypt-option" className="space-y-2">
              <Radio id="s3-sse-s3" label="SSE-S3" checked={data.encryptType === "sse-s3"} onChange={() => onData({ encryptType: "sse-s3" })}
                desc="Amazon S3 managed keys. Default, no additional cost." />
              <Radio id="s3-sse-kms" label="SSE-KMS" checked={data.encryptType === "sse-kms"} onChange={() => onData({ encryptType: "sse-kms" })}
                desc="AWS Key Management Service keys (SSE-KMS). Additional cost for KMS API calls." />
              <Radio id="s3-dsse-kms" label="DSSE-KMS" checked={data.encryptType === "dsse-kms"} onChange={() => onData({ encryptType: "dsse-kms" })}
                desc="Dual-layer server-side encryption with AWS KMS keys. Applies two independent layers of encryption." />
            </div>
          </div>

          {data.encryptType !== "sse-s3" && (
            <div id="s3-bucket-key-option">
              <Checkbox id="s3-bucket-key" label="Enable S3 Bucket Key — reduces encryption costs by up to 99% by decreasing requests to AWS KMS" checked={data.bucketKey} onChange={() => onData({ bucketKey: !data.bucketKey })} />
            </div>
          )}

          <div id="s3-object-lock-option">
            <h3 className="text-white font-medium text-sm mb-2">Object Lock</h3>
            <Checkbox id="s3-object-lock" label="Enable Object Lock — store objects using a write-once-read-many (WORM) model to help prevent objects from being deleted or overwritten" checked={data.objectLock} onChange={() => onData({ objectLock: !data.objectLock })} />
            {data.objectLock && <Warning text="Enabling Object Lock also enables Versioning. You cannot disable Object Lock after bucket creation." />}
          </div>

          <Tip text="For most cases: SSE-S3 is fine and free. Enable versioning if you want to recover accidentally deleted files." />
        </div>
      )}
    </WizardShell>
  );
}

// ── RDS Create Database Wizard ────────────────────────────────────────────

interface RDSWizardState {
  engine: "mysql" | "postgres" | "aurora-mysql" | "aurora-pg" | "mariadb" | "oracle" | "sqlserver";
  template: "production" | "dev-test" | "free";
  identifier: string; username: string; password: string;
  instanceClass: string; storage: number; storageType: "gp2" | "gp3" | "io1";
  multiAZ: boolean; publicAccess: boolean; deletionProtection: boolean;
}

const defaultRDS: RDSWizardState = {
  engine: "postgres", template: "production",
  identifier: "", username: "admin", password: "",
  instanceClass: "db.t3.medium", storage: 20, storageType: "gp3",
  multiAZ: true, publicAccess: false, deletionProtection: true,
};

const RDS_STEPS = ["Engine", "Template & Version", "Settings", "Connectivity"];

export function RDSCreateWizard({ step, data, onStep, onData, onClose }: {
  step: number; data: RDSWizardState; onStep: (n: number) => void;
  onData: (patch: Partial<RDSWizardState>) => void; onClose: () => void;
}) {
  return (
    <WizardShell title="Create database" service="Amazon RDS" step={step} steps={RDS_STEPS} nextLabel="Continue"
      onClose={onClose} onBack={() => onStep(Math.max(0, step - 1))} onNext={() => onStep(Math.min(RDS_STEPS.length - 1, step + 1))}>

      {step === 0 && (
        <div>
          <p className="text-white/40 text-xs mb-4">Choose the database engine that best fits your application needs.</p>
          <div id="rds-engine-option" className="grid grid-cols-2 gap-2">
            {([
              ["postgres","PostgreSQL","Open source, ACID-compliant"],
              ["mysql","MySQL 8.0","Most popular open source DB"],
              ["aurora-mysql","Aurora (MySQL compat.)","Up to 5x faster than MySQL"],
              ["aurora-pg","Aurora (PostgreSQL compat.)","Up to 3x faster than PostgreSQL"],
              ["mariadb","MariaDB","MySQL-compatible, open source"],
              ["sqlserver","Microsoft SQL Server","Enterprise-grade, license included"],
            ] as [RDSWizardState["engine"], string, string][]).map(([val, label, desc]) => (
              <div id={`rds-engine-${val}`} key={val} onClick={() => onData({ engine: val })}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${data.engine === val ? "border-[#FF9900]/50 bg-[#FF9900]/5" : "border-white/10 hover:border-white/20"}`}>
                <div className="text-white text-xs font-medium">{label}</div>
                <div className="text-white/30 text-xs mt-0.5">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-white font-medium text-sm mb-3">Templates</h3>
            <p className="text-white/40 text-xs mb-3">Choose a template to preselect certain configuration options. You can still change all settings.</p>
            <div id="rds-template-option" className="space-y-2">
              <Radio id="rds-template-production" label="Production" checked={data.template === "production"} onChange={() => onData({ template: "production", multiAZ: true, storageType: "io1", storage: 100, deletionProtection: true })}
                desc="Uses defaults for high availability and fast, consistent performance. Enables Multi-AZ and Provisioned IOPS SSD." />
              <Radio id="rds-template-dev" label="Dev/Test" checked={data.template === "dev-test"} onChange={() => onData({ template: "dev-test", multiAZ: false, storageType: "gp3", storage: 20, deletionProtection: false })}
                desc="This instance is intended for development use outside of a production environment." />
              <Radio id="rds-template-free" label="Free tier" checked={data.template === "free"} onChange={() => onData({ template: "free", multiAZ: false, instanceClass: "db.t3.micro", storageType: "gp2", storage: 20, deletionProtection: false })}
                desc="Use RDS Free Tier to learn about Amazon RDS and develop small applications. 750 hours/month, 20 GB storage." />
            </div>
          </div>
          {data.template === "production" && <Warning text="Production template enables Multi-AZ deployment and io1 storage — this significantly increases cost. Make sure this is what you want." />}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="text-white/60 text-xs font-medium block mb-1.5">DB instance identifier <span className="text-red-400">*</span></label>
            <input id="rds-identifier-input" value={data.identifier} onChange={e => onData({ identifier: e.target.value })}
              placeholder="my-database"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder-white/20 focus:outline-none focus:border-[#FF9900]" />
            <p className="text-white/30 text-xs mt-1">Must begin with a letter, 1–63 alphanumeric characters or hyphens</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/60 text-xs font-medium block mb-1.5">Master username</label>
              <input id="rds-username-input" value={data.username} onChange={e => onData({ username: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#FF9900]" />
            </div>
            <div>
              <label className="text-white/60 text-xs font-medium block mb-1.5">Master password</label>
              <input id="rds-password-input" type="password" value={data.password} onChange={e => onData({ password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder-white/20 focus:outline-none focus:border-[#FF9900]" />
            </div>
          </div>
          <div>
            <label className="text-white/60 text-xs font-medium block mb-1.5">DB instance class</label>
            <select id="rds-instance-class-select" value={data.instanceClass} onChange={e => onData({ instanceClass: e.target.value })}
              className="w-full bg-[#161e2d] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#FF9900]">
              {["db.t3.micro (2 vCPU, 1 GiB RAM) — Free tier eligible","db.t3.small (2 vCPU, 2 GiB RAM)","db.t3.medium (2 vCPU, 4 GiB RAM)","db.r6g.large (2 vCPU, 16 GiB RAM)","db.r6g.xlarge (4 vCPU, 32 GiB RAM)"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-white font-medium text-sm mb-3">Storage</h3>
            <div id="rds-storage-type-option" className="space-y-2 mb-3">
              <Radio id="rds-gp3" label="General Purpose SSD (gp3) — recommended" checked={data.storageType === "gp3"} onChange={() => onData({ storageType: "gp3" })}
                desc="3,000 IOPS and 125 MiB/s throughput included free. Cost-effective for most workloads." />
              <Radio id="rds-gp2" label="General Purpose SSD (gp2)" checked={data.storageType === "gp2"} onChange={() => onData({ storageType: "gp2" })}
                desc="Baseline of 3 IOPS/GiB. Bursts to 3,000 IOPS for volumes under 1 TiB." />
              <Radio id="rds-io1" label="Provisioned IOPS SSD (io1) — I/O-intensive workloads" checked={data.storageType === "io1"} onChange={() => onData({ storageType: "io1" })}
                desc="Consistent IOPS performance. Specify the exact IOPS you need. Higher cost." />
            </div>
          </div>

          <div>
            <h3 className="text-white font-medium text-sm mb-3">Availability & durability</h3>
            <div id="rds-multiaz-option" className="space-y-2">
              <Radio id="rds-multi-az" label="Multi-AZ DB instance — recommended for production" checked={data.multiAZ} onChange={() => onData({ multiAZ: true })}
                desc="Creates a primary DB instance and a synchronous standby replica in a different Availability Zone. Provides high availability and failover support." />
              <Radio id="rds-single-az" label="Single DB instance" checked={!data.multiAZ} onChange={() => onData({ multiAZ: false })}
                desc="No standby instance. If the instance fails, recovery takes longer." />
            </div>
          </div>

          <div id="rds-public-access-option">
            <h3 className="text-white font-medium text-sm mb-2">Public access</h3>
            <div className="space-y-2">
              <Radio id="rds-public-yes" label="Yes — assign a public IP to your DB instance" checked={data.publicAccess} onChange={() => onData({ publicAccess: true })}
                desc="Your DB instance will be accessible from outside the VPC using its endpoint. Ensure security group rules restrict access." />
              <Radio id="rds-public-no" label="No — DB instance can only be accessed from within VPC" checked={!data.publicAccess} onChange={() => onData({ publicAccess: false })} />
            </div>
            {data.publicAccess && <Warning text="Public access exposes your database to the internet. Make sure your security group only allows trusted IPs." />}
          </div>

          <div id="rds-deletion-protection-option">
            <Checkbox id="rds-deletion-protection" label="Enable deletion protection — prevents the database from being accidentally deleted" checked={data.deletionProtection} onChange={() => onData({ deletionProtection: !data.deletionProtection })} />
          </div>

          <Tip text="For a new project: gp3 storage, single AZ (save cost), no public access (use a bastion host or RDS Proxy instead). Enable deletion protection always." />
        </div>
      )}
    </WizardShell>
  );
}

export { defaultS3, defaultRDS };
export type { S3WizardState, RDSWizardState };
