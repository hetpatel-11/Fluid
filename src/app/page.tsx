"use client";

import Link from "next/link";
import { ArrowRight, Phone, Zap, Monitor, Mic, GitPullRequest } from "lucide-react";
import FluidLogo from "@/components/FluidLogo";

const CODEX_ICON =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABY2lDQ1BrQ0dDb2xvclNwYWNlRGlzcGxheVAzAAAokX2QsUvDUBDGv1aloHUQHRwcMolDlJIKuji0FURxCFXB6pS+pqmQxkeSIgU3/4GC/4EKzm4Whzo6OAiik+jm5KTgouV5L4mkInqP435877vjOCA5bnBu9wOoO75bXMorm6UtJfWMBL0gDObxnK6vSv6uP+P9PvTeTstZv///jcGK6TGqn5QZxl0fSKjE+p7PJe8Tj7m0FHFLshXyieRyyOeBZ71YIL4mVljNqBC/EKvlHt3q4brdYNEOcvu06WysyTmUE1jEDjxw2DDQhAId2T/8s4G/gF1yN+FSn4UafOrJkSInmMTLcMAwA5VYQ4ZSk3eO7ncX3U+NtYMnYKEjhLiItZUOcDZHJ2vH2tQ8MDIEXLW54RqB1EeZrFaB11NguASM3lDPtlfNauH26Tww8CjE2ySQOgS6LSE+joToHlPzA3DpfAEDp2ITpJYOWwAAAARjSUNQDA0AAW4D4+8AAABsZVhJZk1NACoAAAAIAAQBGgAFAAAAAQAAAD4BGwAFAAAAAQAAAEYBKAADAAAAAQACAACHaQAEAAAAAQAAAE4AAAAAAAAASAAAAAEAAABIAAAAAQACoAIABAAAAAEAAABAoAMABAAAAAEAAABAAAAAADVilk8AAAAJcEhZcwAACxMAAAsTAQCanBgAABBgSURBVHgB7VtZjBTHGf67e2Z29mbZDZc51sAabIMBGxMTBOYBE3uVOLJkKYcS5Ykodh6cPEV+c6QolvPkPNh54CFRnpzESSyLgB1CjI8EEE7AxuFeTofDsCzsxc5MH/m+v7tmm9nu3dkxSJGyZWqqurqq/v///qOObYtMpSkEphCYQmAKgf9fBKzPK3oQBPbw8PCsbDY7G7nd87wWzFmHnEG2P+/80XgfpYtccBynv1Qq9SJfbGhouGRZFt/VnGoGoFgsfhHMPG3b9kZQXwQgpoGZmuebjASgFYDUdYzpQd4NMF7P5XL7JjNHzX0h+Crf998ADyUyUpnwLrhTuZJW7LlEnshbzYJVMxAEngXRG4bwnRJ0svMafsgbXPDZamQxfar2UZjZT+Djr2BgCwgJ8/9KivHTApd8hbxWy1tVPkvNR8ILtFPt3In9lGBE9U5gCACUbqFQ+EE+n381kYlY44QA9PX1rWptbX0PQaepVuFNaPRhNMSPgrONvNp3AAyCAKsYvHHjxoa2trYDMXnHVJ0xLbGGF154wd60adNWRPtltQhPIZkHbwbSNyDSh7jdd0Pker9I/6DI0E2RYgkE0SebtbRvjHzNVboEQMhlMpm54P213bt3p/prhH8yrd7e3rVA8H28dQwAZqUjEVNPGk3NjhQD+fRyIAMQvAhhXY+xAxYQmQQtIIPdQn2DJc3TApnVbkl9zhLlVs2EM2MijuF/KEmTtPVNVK/kIwKAXTxY8Pr29vY9OiDhh5uV1FRfX/91TO4gspb7GOJsiNfLHVChYNcHAzl8NBAXmnehZYvmTnuDPJZFccAdchEuMXQjkOu9lvT1BbJgXiAOBHMjkplMIDlwWZcN58Uqi1FhMvRNadpZUmHQvkMZ8JgKQKoLwPxzGzdu/ClMaVYSgTixeJ3KHRoJZO9eH/CDkRJMm5pj7ETWksLxmWVUL45gmzckMtBvyYVPYTnnA7lwIZBLlwLphQUNwIIIXmN99a7CWAAF5oHDr+AGEaSYJ5YwZXLas2dP55o1aw5ikta4BST3jrVC2nfe86VwEaadRzspIBOYMLMS9UepLgGAfFRcgELNU8nwFs0lPLOdG+umVkvmzhVZ1mXBKugK0TwJBZWGGEArvbFv376Va9euPZPQTffrSe0ye/bsOUCvhaZUrQU4sKfT53357GQgM8FswN07haWgLFDaNmpsi55pHSoHfvgKFq/GoVajL/Ae/Qtwo8uXfbnSK9LbZ8mjD1uSnQAE8k4ZKAvInSHNypQaA7Dud2CwZYJf5cDKZ/o9bf3wJ4HkIWGJfs9OkbAsFQCW6MtmPjOpnPjRNj6wzkzNx54ZWAnE0ePQLtDa+AgQ5/uURMXBgi3KktIl3QJgPs0cNJH2jRBXr8Nfr2DJwzJXB+aKRXAbCagFH5EpBMHSOgnoS1ZCWUyMM3uGsAzUKnz2RQ4w/uC/RebP8WXxfFs8ApWQDO9GloQu6QBA+fRgTWYi82xKmvwQ1vgDR0QunUVER9CzYPYjYJKRnszinyaWKjwqZQCAAttMHxUOwygPY4DLuKAl6mxDR4LA9yW07z/oSydiAsJiYjyADOipSizLog2xn1QXgND6LlV4aKGvP5BtuwO5ehYbmSIyRjhoV6FC2mVSfKTgDioGCAeWYqyC71mHXGEQRMngB4vXTINykQkCM1V37oLI1WuBzMD+ISkgGt4BRKqcqS/oOyCTmMjoMJa619/y5XyPSB6CubCGItSEqgqoA80MkEoFhaYMAFpGYBlA2IeJIIQWEApPwUvo6yGrBeCZVlAoWHLpMwTcVA/nbAQ+XZZUAMKh4a9Bkk8qCBj4G9b5o8dC4bGEq4mq8FEf7vnpm2oReEHZoKcyQAYIFR5vWHJu5lusAM+qeQqPTP+n8ASoBMD7sa0Ot1W0Ao4cTcYFRlvG1iYEYOykIheu+PL3f4bMkjldt8GVuj2eKcHMmZZ0LbTl+Eksi1cgeNTOAjJoNmA6GKjt+IkDoIKis/p+JLwCgPlJkwCQvzCPFa6S97E91JOSmtPb6McfHQlkcNiSfJ3KqtogQ2SewufQ3v3lrMydbcvSJb78+rdFuTkczkmQ2KcsMB4JCMeyzSR2IwA0ee4DKLhm1vGS8cFCgGhqCJ/NuMmWE1pA5YSlki8nzwE5CGljf66JnIIpMq0l4gGbeApsn27Jgysceecfnvq/6cOu0UJRBk7B4RScCzmaVgEIUQppsJ3uZSPnEN9pXYn7XBKZIBH8cdOoiZH1QG7C4fvgd1kA4ACATA4lwUCpGfWb4Gb/xx40GmDjEsjqFRlp77BGlzFQpT/TtDXAYWouazwYFTC2ANMul6jzyFzAKlMoRBk8FBGECfBbHwDoIa4mxhVuLccVDi8nBKBygiIWZu7XMzi2Oik5jwPL4bO+XECEpms01IusfdCRAJahCxLtDnXdhbCOTPNmlKcmIbOu/3oeACglVFzQLQKlIo7YJWQXgHjIH30i8vYHIQAYNuk0OQAgDPfyGtkhgAPGeZ7XDGtQi6BVwAoo0P4jPEeE9wLL7rFl/l1QOdptjGFfh9aDkq5EYCzMSZCMv5slD1OEcQZg6OoClDwNgCEIu/ciMANsxqfJpqqGlN0AJp0H09OawAi40j09GOY5n5k7Q1PWwTfP4PBy+j9hhOe71cucUeEJVAUIBMaAEy8tHHpI65YoGQVDBs9ebMEPYjdqM4gAccNvNWBMCEB8KaE2eQLrnOuLC39kYhv+hTlW5ztG6svYqWkdWmtuhNtEmrZxBeaUc2QRBAUA04IYY7TOZwXLQon9Aq2HQBFscK9aB50TZ7kRC2kpQfzEeTdtlSWmmlyiwPd3BfIhlkIXEUzX92gKvtPlDFqhhbTiquv+hbbuELlNPnYGwIHZHAUxzGOsz0GAkAU8TMHkTxAzeR8mz4spG5HTR+kjLrCNwZR9r+HShFdwDXWYBM/VpqoAMEgqn5h59hcsWbnEk72HM9BKRC0qLCDCflymHlxpSyNcASunXISPHjgSLoVkTucirxjHobwnVJdCm0l8ZwNJh0CAUwpOEEIwAASswKfW8c8FGDyCS44uEM5w23eCZmIH6vvSKlcuXfPkxDlcO0UcUygLKqT252MTdM8CW0bAFLX9/oeeDGMzlAcgBNRHhOM43vW1NoWHGQOKltGcHjTei6N2CSsAA6ANAHhMYxAkAB4Ap6XkIDgPV2HECQcbxUVTJRZVWUDlSDLY1mLLqns8+dcB+CaWQwqjGoSw9NHV99sKBHc7x0/houS4r35NTXFnx9WkAcvl1x7N6G2wgstJKhKbPunxZdd+Tzc+PgEGDdLSEu8553TcKucAplFSxTSpj1UBQCQrzYnB8HqvLX2XcVHZGuJuAGhEsGtrwa0Q/JSa2vWuKwWemGAZNOMMMpfDjlbkNiu0EkUw4jMy4aiQu2bw+ivcDKmVEUBkLpeG5t3zcEsEi5hsmhAAY0amHCWAnRhucUdg1hoIwRCZo7nzmnvnTk8eXm3Lvv2+nIIFcFnkHSGtxYWmuCyew83vvgOedM7DoCiVzR9zaQIKH8N6hnW3F2qYJm8yAW1pCeS+RWjE7mosn9E8KcWEAKSMU1NzcIPJ5TBaEYFACALH/OVtV3bthH9CNgrvIxbQNRwETd0ERZT/9GdX6rDU2bAobQcwZokjGDRprhxx7VJ4Y008Ea5f4Y26URrDKe2fC4D26ZgVEa+EO/u472kdjHsMSRCImlcBKRxBQGZpzJnjbYAZAoQ6QOMdhpp3BCrPDOVE30BmsF12ry/rVvnoj8lrSKkA4DaYZFJNihH5rjkBzA9/BcJOjMKwTU0zYlD5QTt5sxxsVQlABIKNGxEKSGEJEl1Ct8UEh30Q7AxALNW6dELyhKiPALpyhS/d611paQhXojTzN7JEw28pUgFA0IPe0hOF5VXUsgd8eedtW01UNybwSfolNaSWAOZVEAhKIYzAKiAFRVYgwAl3hmWQOI7gmPEoiSsFn9uJw9UaTx5a6sq0RhvLH16Ok8aTJRUA1zWb3fSZs9Di5sd8+XCfLTdxHc4UQHhmgqC+yjZ9o/LrDzUe176aPMGAG9A1FCQKbwCAgJxrwVKRJ7o9WTzPlQ5c2udzDoAfX3iSHk+WVADwgcFgxHeiG1Az1PB92BZ/5SlPfvcbTIVlT1McBDYhm7ig7zFWhYuENFonMLfUo36cgMHu3kWerHsAu0n8R8Gp+DSzJx2zdMdlUfqxn1QA8OkbP0Uj+yAzNqlAaM6C4ycfd2Vg0JLtrzvi45JCZTbxACWjibGG8kwULspG47cIH1kJ++hSN0Nk3SO+5LN4wZ0UEulMlCgDZUnrBx0kp/Pnz18EugO4Uk7uELWSweZ6R771tCvffcaVGZ1Y56EtXliQccYKltzDl3iJYdrYTpAghQIUgUT34Y0IVw4unbz04DL4+Fc9WTQf7yLhx2Uqeom/CtNCBihLWn/AmZxgPoXu7u6n8f3dTKCo5kRzM2bFUebZBgo5mOTCTk+WP+RJGy4+uEd3eXIDwwxujfhjaTvaB3Fq4+6QLqCRHQBqDMCzKU18IA0Kv6E7kO9808XBykmkb/hgGU91dXX0/2PPPffcL3p6enhUGpNCWxrTHDZcvXr1VXxd8czAAL5yqCKRvotjYAG5HzvE3uu29A+Ex9eGxkDq6wP54+8zsuM1R4rY2emZH06oS6DxfwBBABhOsoj4G7p9+fY3SjKrbeJoX8lic3Oz4CuXX3Z0dKR+OpcaAzjZqVOn/oAPpL4HNyh/IlNJJP5Md8hmuCTakkdE72jm0RQqZCLUEOr7W0py7zJfdryRkZ5DlhSHR4+vBJAnvXwz/qawNJBNT5Rk3cOetNZPXni6LrTvUQaln/IzrgV0dnbmDx48+CZAeKxaK0ihU272oNoCAkEvbpaP9Thy4pgtn10CEPgzVx53/LP4F98uX7ru9mQ6lro6mIdTxVJXJhBVqP3+/v6dK1asePLMmTM8iiWmcQHgiF27dm1Yv379DqDZwFhwOxIUjWCIkyKiYAkRkF+BMBByWWOQz6LCO4dq1vgkfvA9AL8OGcZnMd2bN29+N6mPaZsQAHS0Tpw48ePFixe/ODQ0BMYZpm9fUrOnbzC6h/90eayVAiN/Y2OjnDx58vmurq6XMA/xTk3VAMDB+bNnz744b968H46MjOB25vZYQipXNb6g5vF1qGDZe3nBggXPY5pU0zckqgWA/eqPHj36o4ULFz4P82q8E9ZgmJpsyYDX1NTEoDd0+vTpny1ZsuRlzIEz5vjaJx2uxtUkmtHNpUuXvrRjx46n8PHhX4G2j+CIpa1ev8bi/iC+R6hm0lr6GDpQgtImD9ir+ORp27ZtT0H4n5NX5HFN39Cu1gJMf5Yc07p9+/b1y5cvfxIMPAK/mw8tNIMpiz6onbgm3sZkNjmMQdA0/5+EAdTP4XvgvYcOHXoTm7b3QY5HsqoEN6zVyqUZl8VSOX3Lli1zYB2z8VltO3ZfTdBIHTSFDz51v2do1VxCeHxGGHj4ah3nmsIgtN0Ld7y4devWC1jirmFiE5QmJTwZMoLUzFzKHLdj3iSekgRMaksaO9U2hcAUAlMITCFQicB/Af4aQ0pMxa7aAAAAAElFTkSuQmCC";

// ── Shared animation styles ────────────────────────────────────────────────
const ANIM_STYLES = `
  .tb { transform-box: fill-box; transform-origin: center; }

  @keyframes rippleOut {
    0%   { r: 32; opacity: 0.14; }
    100% { r: 62; opacity: 0; }
  }
  @keyframes rippleOut2 {
    0%   { r: 32; opacity: 0.08; }
    100% { r: 78; opacity: 0; }
  }
  @keyframes dashRight {
    to { stroke-dashoffset: -20; }
  }
  @keyframes cursorGlide {
    0%,15%  { transform: translate(0px,0px);    opacity:0; }
    22%     { opacity:1; }
    48%,68% { transform: translate(98px,-42px); opacity:1; }
    76%     { opacity:0; }
    100%    { transform: translate(0px,0px);    opacity:0; }
  }
  @keyframes btnPop {
    0%,38%  { fill:#e5e7eb; }
    52%,70% { fill:#FF9900; }
    84%,100%{ fill:#e5e7eb; }
  }
  @keyframes sideShift {
    0%,42%  { fill:#374151; }
    56%,78% { fill:#0284c7; }
    90%,100%{ fill:#374151; }
  }
  @keyframes donePop {
    0%,50%  { opacity:0; transform:scale(0.85) translateY(5px); }
    62%,80% { opacity:1; transform:scale(1)    translateY(0px); }
    93%,100%{ opacity:0; transform:scale(0.85) translateY(5px); }
  }

  @keyframes codexPing {
    0%   { r: 32; opacity: 0.14; }
    100% { r: 58; opacity: 0; }
  }
  @keyframes fontValChange {
    0%,25%  { fill:#86efac; }
    38%,62% { fill:#fde68a; }
    75%,100%{ fill:#86efac; }
  }
  @keyframes zapBadge {
    0%,35%  { opacity:0; transform:translateY(7px); }
    48%,72% { opacity:1; transform:translateY(0); }
    85%,100%{ opacity:0; transform:translateY(7px); }
  }
  @keyframes checkDraw {
    0%   { stroke-dashoffset: 60; }
    50%  { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: 0; }
  }
`;

// ── SVG animation 1 — Web (Fluid guides + changes the website) ─────────────
function FluidWebAnimation() {
  return (
    <div className="w-full rounded-2xl border border-black/[0.07] bg-[#fafafa] py-10 px-6 overflow-hidden">
      <style>{ANIM_STYLES}</style>
      <svg viewBox="0 0 760 172" xmlns="http://www.w3.org/2000/svg" className="w-full">

        {/* ── Node 1: Fluid logo ── */}
        <circle cx="70" cy="84" r="32" fill="black" className="tb">
          <animate attributeName="r"       values="32;62;32" dur="2.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.14;0;0.14" dur="2.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="70" cy="84" r="32" fill="black" className="tb">
          <animate attributeName="r"       values="32;80;32" dur="2.8s" begin="0.55s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.08;0;0.08" dur="2.8s" begin="0.55s" repeatCount="indefinite" />
        </circle>
        <circle cx="70" cy="84" r="29" fill="black" />
        <text x="70" y="90" textAnchor="middle" fontFamily="Inter,system-ui,sans-serif"
          fontSize="17" fontWeight="800" fill="white">F</text>
        <text x="70" y="136" textAnchor="middle" fontFamily="Inter,system-ui,sans-serif"
          fontSize="10" fontWeight="600" fill="black" opacity="0.38">Fluid calls you</text>

        {/* connector 1 */}
        <line x1="104" y1="84" x2="200" y2="84" stroke="black" strokeWidth="1.5"
          strokeDasharray="5 5" opacity="0.18">
          <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="0.45s" repeatCount="indefinite" />
        </line>
        <polygon points="198,79 211,84 198,89" fill="black" opacity="0.18" />

        {/* ── Node 2: Browser + cursor ── */}
        <rect x="219" y="40" width="222" height="108" rx="8" fill="white"
          stroke="black" strokeWidth="1" strokeOpacity="0.09" />
        {/* chrome */}
        <rect x="219" y="40" width="222" height="21" rx="8" fill="#f0f0f0" />
        <rect x="219" y="53" width="222" height="8"  fill="#f0f0f0" />
        <circle cx="232" cy="51" r="3.5" fill="#ff5f57" />
        <circle cx="244" cy="51" r="3.5" fill="#febc2e" />
        <circle cx="256" cy="51" r="3.5" fill="#28c840" />
        {/* sidebar — animates to blue */}
        <rect x="219" y="61" width="42" height="87"
          style={{ animation: 'sideShift 6s ease-in-out infinite', fill: '#374151' }} />
        <circle cx="240" cy="75" r="3" fill="white" opacity="0.4" />
        <circle cx="240" cy="87" r="3" fill="white" opacity="0.3" />
        <circle cx="240" cy="99" r="3" fill="white" opacity="0.22" />
        {/* main */}
        <rect x="261" y="61" width="180" height="87" fill="#f9fafb" />
        {/* button — pulses orange */}
        <rect x="348" y="69" width="74" height="22" rx="5"
          style={{ animation: 'btnPop 6s ease-in-out infinite', fill: '#e5e7eb' }} />
        <text x="385" y="84" textAnchor="middle" fontFamily="Inter,sans-serif"
          fontSize="8" fontWeight="700" fill="black" opacity="0.55">Launch</text>
        <rect x="265" y="103" width="172" height="9" rx="2" fill="#e5e7eb" />
        <rect x="265" y="117" width="172" height="9" rx="2" fill="#e5e7eb" />
        <rect x="265" y="131" width="118" height="7" rx="2" fill="#e5e7eb" />
        {/* cursor */}
        <g className="tb" style={{ animation: 'cursorGlide 6s ease-in-out infinite',
          transformOrigin: '285px 131px' }}>
          <polygon points="0,0 0,13 3,9 5.5,14.5 7.5,13.5 5,8.5 10,8.5" fill="black" />
        </g>

        <text x="330" y="163" textAnchor="middle" fontFamily="Inter,system-ui,sans-serif"
          fontSize="10" fontWeight="600" fill="black" opacity="0.38">Guides you through it</text>

        {/* connector 2 */}
        <line x1="445" y1="84" x2="538" y2="84" stroke="black" strokeWidth="1.5"
          strokeDasharray="5 5" opacity="0.18">
          <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="0.45s" repeatCount="indefinite" />
        </line>
        <polygon points="536,79 549,84 536,89" fill="black" opacity="0.18" />

        {/* ── Node 3: Changed browser ── */}
        <rect x="557" y="40" width="190" height="108" rx="8" fill="white"
          stroke="black" strokeWidth="1" strokeOpacity="0.09" />
        <rect x="557" y="40" width="190" height="21" rx="8" fill="#f0f0f0" />
        <rect x="557" y="53" width="190" height="8"  fill="#f0f0f0" />
        <circle cx="570" cy="51" r="3.5" fill="#ff5f57" />
        <circle cx="582" cy="51" r="3.5" fill="#febc2e" />
        <circle cx="594" cy="51" r="3.5" fill="#28c840" />
        {/* blue sidebar = changed state */}
        <rect x="557" y="61" width="38" height="87" fill="#0284c7" />
        <circle cx="576" cy="75" r="3" fill="white" opacity="0.65" />
        <circle cx="576" cy="87" r="3" fill="white" opacity="0.5" />
        <circle cx="576" cy="99" r="3" fill="white" opacity="0.4" />
        <rect x="595" y="61" width="152" height="87" fill="#f0f9ff" />
        <rect x="601" y="69" width="138" height="14" rx="3" fill="#bae6fd" />
        <rect x="601" y="89" width="138" height="9"  rx="2" fill="#e0f2fe" />
        <rect x="601" y="103" width="138" height="9" rx="2" fill="#e0f2fe" />
        <rect x="601" y="117" width="90"  height="9" rx="2" fill="#e0f2fe" />
        {/* Done badge */}
        <g className="tb" style={{ animation: 'donePop 6s ease-in-out infinite',
          transformOrigin: '649px 140px' }}>
          <rect x="612" y="132" width="74" height="20" rx="10" fill="#22c55e" />
          <text x="649" y="146" textAnchor="middle" fontFamily="Inter,sans-serif"
            fontSize="9" fontWeight="700" fill="white">✓ Done</text>
        </g>

        <text x="652" y="163" textAnchor="middle" fontFamily="Inter,system-ui,sans-serif"
          fontSize="10" fontWeight="600" fill="black" opacity="0.38">UI changed live</text>
      </svg>
    </div>
  );
}

// ── SVG animation 2 — Electron (Fluid changes the Codex app) ──────────────
function FluidElectronAnimation() {
  return (
    <div className="w-full rounded-2xl border border-black/[0.07] bg-[#fafafa] py-10 px-6 overflow-hidden">
      <svg viewBox="0 0 760 172" xmlns="http://www.w3.org/2000/svg" className="w-full">
        <defs>
          <clipPath id="codexClip">
            <rect x="43" y="57" width="54" height="54" rx="13" />
          </clipPath>
        </defs>

        {/* ── Node 1: Real Codex icon ── */}
        <circle cx="70" cy="84" r="32" fill="black" className="tb">
          <animate attributeName="r"       values="32;60;32" dur="2.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.14;0;0.14" dur="2.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="70" cy="84" r="32" fill="black" className="tb">
          <animate attributeName="r"       values="32;76;32" dur="2.8s" begin="0.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.08;0;0.08" dur="2.8s" begin="0.6s" repeatCount="indefinite" />
        </circle>
        <image href={CODEX_ICON} x="43" y="57" width="54" height="54" clipPath="url(#codexClip)" />
        <text x="70" y="136" textAnchor="middle" fontFamily="Inter,system-ui,sans-serif"
          fontSize="10" fontWeight="600" fill="black" opacity="0.38">Codex connected</text>

        {/* connector 1 */}
        <line x1="102" y1="84" x2="200" y2="84" stroke="black" strokeWidth="1.5"
          strokeDasharray="5 5" opacity="0.18">
          <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="0.45s" repeatCount="indefinite" />
        </line>
        <polygon points="198,79 211,84 198,89" fill="black" opacity="0.18" />

        {/* ── Node 2: Codex editor with realistic TypeScript ── */}
        <rect x="219" y="35" width="250" height="116" rx="8" fill="#1e1e2e"
          stroke="black" strokeWidth="1" strokeOpacity="0.2" />
        {/* title bar */}
        <rect x="219" y="35" width="250" height="22" rx="8" fill="#13131f" />
        <rect x="219" y="49" width="250" height="8"  fill="#13131f" />
        <circle cx="232" cy="46" r="3.5" fill="#ff5f57" />
        <circle cx="244" cy="46" r="3.5" fill="#febc2e" />
        <circle cx="256" cy="46" r="3.5" fill="#28c840" />
        <text x="344" y="50" textAnchor="middle" fontFamily="Inter,sans-serif"
          fontSize="8" fill="white" opacity="0.3">utils/api.ts — Codex</text>
        {/* gutter */}
        <rect x="219" y="57" width="26" height="94" fill="#16162a" />
        {[1,2,3,4,5,6,7].map((n, i) => (
          <text key={n} x="232" y={69 + i * 13} textAnchor="middle"
            fontFamily="monospace" fontSize="7.5" fill="white" opacity="0.2">{n}</text>
        ))}
        {/* realistic TypeScript — async fetch function */}
        <text x="251" y="69"  fontFamily="monospace" fontSize="8.5">
          <tspan fill="#cba6f7">{"async function "}</tspan>
          <tspan fill="#89b4fa">{"fetchUser"}</tspan>
          <tspan fill="#cdd6f4">{"(id: "}</tspan>
          <tspan fill="#a6e3a1">{"string"}</tspan>
          <tspan fill="#cdd6f4">{")"}</tspan>
        </text>
        <text x="251" y="82"  fontFamily="monospace" fontSize="8.5">
          <tspan fill="#cdd6f4">{"  : "}</tspan>
          <tspan fill="#89b4fa">{"Promise"}</tspan>
          <tspan fill="#cdd6f4">{"<"}</tspan>
          <tspan fill="#a6e3a1">{"User"}</tspan>
          <tspan fill="#cdd6f4">{"> {"}</tspan>
        </text>
        <text x="251" y="95"  fontFamily="monospace" fontSize="8.5">
          <tspan fill="#cba6f7">{"  const "}</tspan>
          <tspan fill="#cdd6f4">{"res = "}</tspan>
          <tspan fill="#cba6f7">{"await "}</tspan>
          <tspan fill="#89b4fa">{"fetch"}</tspan>
          <tspan fill="#cdd6f4">{"(`/api/"}</tspan>
        </text>
        <text x="251" y="108" fontFamily="monospace" fontSize="8.5">
          <tspan fill="#cdd6f4">{"    users/${id}`)"}</tspan>
        </text>
        <text x="251" y="121" fontFamily="monospace" fontSize="8.5">
          <tspan fill="#cba6f7">{"  return "}</tspan>
          <tspan fill="#cdd6f4">{"res."}</tspan>
          <tspan fill="#89b4fa">{"json"}</tspan>
          <tspan fill="#cdd6f4">{"()"}</tspan>
        </text>
        <text x="251" y="134" fontFamily="monospace" fontSize="8.5">
          <tspan fill="#cdd6f4">{"}"}</tspan>
        </text>
        {/* font-size overlay badge — value animates 13→18 */}
        <rect x="360" y="133" width="100" height="15" rx="5" fill="#2d2d44" />
        <text x="367" y="143" fontFamily="monospace" fontSize="7.5" fill="white" opacity="0.32">font-size:</text>
        <text x="421" y="143" fontFamily="monospace" fontSize="8" fontWeight="800"
          style={{ animation: 'fontValChange 5s ease-in-out infinite', fill: '#a6e3a1' }}>
          <animate attributeName="font-size" values="8;11;8" dur="5s" repeatCount="indefinite" begin="1.2s" />
          18px
        </text>

        <text x="344" y="163" textAnchor="middle" fontFamily="Inter,system-ui,sans-serif"
          fontSize="10" fontWeight="600" fill="black" opacity="0.38">Font grows live on the call</text>

        {/* connector 2 */}
        <line x1="473" y1="84" x2="550" y2="84" stroke="black" strokeWidth="1.5"
          strokeDasharray="5 5" opacity="0.18">
          <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="0.45s" repeatCount="indefinite" />
        </line>
        <polygon points="548,79 561,84 548,89" fill="black" opacity="0.18" />

        {/* ── Node 3: Confirmation ── */}
        <circle cx="648" cy="84" r="42" fill="#f0fdf4" />
        <circle cx="648" cy="84" r="42" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.3" />
        <polyline points="626,84 642,100 672,68" fill="none"
          stroke="#22c55e" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="60" strokeDashoffset="60">
          <animate attributeName="stroke-dashoffset" values="60;0;0;60" dur="5s"
            keyTimes="0;0.3;0.7;1" repeatCount="indefinite" />
        </polyline>
        <g className="tb" style={{ animation: 'zapBadge 5s ease-in-out infinite',
          transformOrigin: '648px 142px' }}>
          <rect x="606" y="134" width="84" height="20" rx="10" fill="black" />
          <text x="648" y="148" textAnchor="middle" fontFamily="Inter,sans-serif"
            fontSize="9" fontWeight="700" fill="white">⚡ App changed</text>
        </g>

        <text x="648" y="163" textAnchor="middle" fontFamily="Inter,system-ui,sans-serif"
          fontSize="10" fontWeight="600" fill="black" opacity="0.38">Applied instantly</text>
      </svg>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased overflow-x-hidden">

      {/* Nav */}
      <nav className="sticky top-0 z-50 h-14 flex items-center justify-between px-8 border-b border-black/[0.07] bg-white/90 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <FluidLogo size={24} />
          <span className="font-bold text-[15px] tracking-tight">Fluid</span>
        </div>
        <div className="flex items-center gap-7">
          <Link href="/aws"      className="text-[13px] text-black/40 hover:text-black/70 transition-colors no-underline">Demo</Link>
          <Link href="/electron" className="text-[13px] text-black/40 hover:text-black/70 transition-colors no-underline">Electron</Link>
          <a href="https://github.com/hetpatel-11/Fluid" target="_blank" rel="noopener noreferrer"
            className="text-[13px] text-black/40 hover:text-black/70 transition-colors no-underline">GitHub</a>
          <Link href="/aws"
            className="inline-flex items-center gap-1.5 bg-black text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-black/80 transition-colors no-underline">
            Try demo
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-8 flex flex-col items-center text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 border border-black/[0.10] rounded-full px-4 py-1.5 text-[11px] font-semibold tracking-[0.07em] uppercase text-black/35 mb-10">
          YC · Call My Agent Hackathon · 2026
        </div>
        <h1 className="text-[clamp(52px,8vw,88px)] font-extrabold tracking-[-0.045em] leading-[1.02] mb-6 text-black">
          Customer support<br />
          <span className="text-black/20">isn&apos;t supposed to</span><br />
          be a chatbot.
        </h1>
        <p className="text-[clamp(15px,2vw,18px)] text-black/45 leading-relaxed max-w-[480px] mb-3">
          Feature requests are a thing of the past.
        </p>
        <p className="text-[clamp(14px,1.6vw,16px)] text-black/30 leading-relaxed max-w-[440px] mb-12">
          Fluid calls your users. They speak — the product changes live
          while they&apos;re still on the phone. No ticket. No queue.
        </p>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Link href="/aws"
            className="inline-flex items-center gap-2 bg-black text-white font-bold text-[15px] px-7 py-3.5 rounded-xl hover:bg-black/80 transition-colors no-underline">
            See it live <ArrowRight size={15} />
          </Link>
          <Link href="/electron"
            className="inline-flex items-center gap-2 border border-black/[0.12] text-black/55 text-[15px] font-medium px-7 py-3.5 rounded-xl hover:border-black/25 hover:text-black/80 transition-colors no-underline">
            Electron demo
          </Link>
        </div>
      </section>

      {/* Web animation banner */}
      <div className="px-8 pb-20 max-w-[1100px] mx-auto w-full">
        <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-black/25 mb-4">
          For web apps — navigate &amp; change any UI via voice
        </p>
        <FluidWebAnimation />
      </div>

      {/* Feature strip */}
      <div className="border-y border-black/[0.07]">
        <div className="max-w-[1100px] mx-auto px-8 grid grid-cols-3">
          {[
            { icon: <Phone size={15} />,   title: "Real phone call",   desc: "Your phone actually rings. Speak naturally — no typing, no chat widget, no prompts to memorise." },
            { icon: <Zap size={15} />,     title: "Live UI changes",   desc: "The product updates while you're still on the call. Zero round-trip. Zero lag." },
            { icon: <Monitor size={15} />, title: "Any Chromium app",  desc: "Websites via WebSocket. Electron apps via CDP on :9224. If it runs Chromium, Fluid can change it." },
          ].map(({ icon, title, desc }, i) => (
            <div key={title} className={`py-10 px-8 ${i < 2 ? "border-r border-black/[0.07]" : ""}`}>
              <div className="text-black/25 mb-4">{icon}</div>
              <div className="text-[14px] font-semibold tracking-tight mb-2.5 text-black">{title}</div>
              <div className="text-[13px] text-black/40 leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Electron animation banner */}
      <div className="px-8 py-20 max-w-[1100px] mx-auto w-full">
        <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-black/25 mb-4">
          For desktop apps — Codex, VS Code, Slack, any Electron app
        </p>
        <FluidElectronAnimation />
      </div>

      {/* How it works */}
      <div className="border-y border-black/[0.07]">
        <div className="max-w-[1100px] mx-auto px-8 py-20">
          <h2 className="text-[clamp(28px,4vw,48px)] font-extrabold tracking-[-0.04em] leading-tight mb-16 text-black">
            How it works
          </h2>
          <div className="grid grid-cols-3 gap-16">
            {[
              { n: "01", icon: <Phone size={16} />,          title: "Click Ask Fluid",        body: "A button embedded in your app. Enter your number — Fluid calls you back in seconds." },
              { n: "02", icon: <Mic size={16} />,            title: "Speak naturally",         body: "Navigate, restyle, open apps, walk through wizards. No commands, no forms, just a conversation." },
              { n: "03", icon: <GitPullRequest size={16} />, title: "Change is live + logged", body: "UI updates immediately on the call. Every change opens a GitHub PR with your voice as context." },
            ].map(({ n, icon, title, body }) => (
              <div key={n}>
                <div className="text-black/20 mb-4">{icon}</div>
                <div className="text-[10px] font-bold text-black/20 tracking-[0.1em] uppercase mb-2.5">{n}</div>
                <div className="text-[15px] font-bold tracking-tight mb-2.5 text-black">{title}</div>
                <div className="text-[13px] text-black/40 leading-relaxed">{body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-28 px-8 text-center">
        <h2 className="text-[clamp(36px,5.5vw,68px)] font-extrabold tracking-[-0.04em] leading-tight mb-5 text-black">
          The demo is live right now.
        </h2>
        <p className="text-[16px] text-black/35 max-w-md mx-auto mb-12 leading-relaxed">
          Call yourself. Say something. Watch the console change while you&apos;re still on the phone.
        </p>
        <div className="flex items-center gap-3 justify-center flex-wrap">
          <Link href="/aws"
            className="inline-flex items-center gap-2 bg-black text-white font-bold text-[15px] px-8 py-3.5 rounded-xl hover:bg-black/80 transition-colors no-underline">
            Open AWS demo <ArrowRight size={15} />
          </Link>
          <Link href="/electron"
            className="inline-flex items-center gap-2 border border-black/[0.12] text-black/55 text-[15px] font-medium px-8 py-3.5 rounded-xl hover:border-black/25 hover:text-black/80 transition-colors no-underline">
            Electron app demo
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-black/[0.07] px-8 py-6 flex items-center justify-between text-[12px] text-black/25">
        <div className="flex items-center gap-2">
          <FluidLogo size={16} />
          <span>Fluid — YC Call My Agent Hackathon 2026</span>
        </div>
        <span>AgentPhone · Claude · CDP</span>
      </div>

    </div>
  );
}
