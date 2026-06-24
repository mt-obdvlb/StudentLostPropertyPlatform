"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";

export function ReviewActionPanel({
  loading,
  onApprove,
  onReject,
}: {
  loading?: boolean;
  onApprove: (comment: string) => void;
  onReject: (comment: string) => void;
}) {
  const [comment, setComment] = useState("");

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="reviewComment">审核备注</Label>
        <Textarea
          id="reviewComment"
          rows={3}
          placeholder="例：证明材料齐全，予以通过；或描述驳回原因"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button
          variant="destructive"
          onClick={() => onReject(comment)}
          disabled={loading}
        >
          <X className="mr-1 size-4" />
          驳回
        </Button>
        <Button onClick={() => onApprove(comment)} disabled={loading}>
          <Check className="mr-1 size-4" />
          通过
        </Button>
      </div>
    </div>
  );
}
