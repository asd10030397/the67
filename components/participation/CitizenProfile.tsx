"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/the67/motion";
import { formatJoinDate, shortenWallet } from "@/lib/participation/mock";
import { shortenSignature } from "@/lib/participation/message";
import type { Citizen } from "@/lib/participation/types";
import { ParticipationCounter } from "./ParticipationCounter";
import { useParticipation } from "./ParticipationProvider";

interface CitizenProfileProps {
  citizen: Citizen;
}

function ProfileField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-t border-white/10 py-6 first:border-t-0 first:pt-0">
      <p className="mb-2 text-[10px] font-light tracking-[0.34em] text-white/35 uppercase">
        {label}
      </p>
      <p className="text-[clamp(0.95rem,2.2vw,1.1rem)] font-light leading-[1.5] tracking-[-0.01em] text-white/75">
        {value}
      </p>
    </div>
  );
}

export function CitizenProfile({ citizen }: CitizenProfileProps) {
  const { participantCount } = useParticipation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 1.8, ease: EASE.entrance },
      }}
    >
      <p className="mb-6 text-[10px] font-light tracking-[0.34em] text-white/35 uppercase">
        Citizen
      </p>

      <h1 className="mb-16 text-[clamp(2rem,6vw,3.5rem)] font-light leading-none tracking-[-0.05em] text-white">
        {citizen.id}
      </h1>

      <ParticipationCounter
        value={participantCount}
        className="mb-16"
      />

      <div>
        <ProfileField label="Citizen ID" value={citizen.id} />
        <ProfileField
          label="Join Date"
          value={formatJoinDate(citizen.joinDate)}
        />
        <ProfileField
          label="Wallet"
          value={shortenWallet(citizen.wallet)}
        />
        <ProfileField label="Generation" value={citizen.generation} />
        <ProfileField label="Status" value={citizen.status} />
        {citizen.participation ? (
          <>
            <ProfileField
              label="Signature"
              value={shortenSignature(citizen.participation.signature)}
            />
            <ProfileField
              label="Timestamp"
              value={citizen.participation.timestamp}
            />
            <ProfileField label="Nonce" value={citizen.participation.nonce} />
          </>
        ) : null}
      </div>
    </motion.div>
  );
}
