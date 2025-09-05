"use client";

import { useState, useRef, useCallback } from "react";
import { useAccount } from "wagmi";
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction";
import { useNotification } from "./NotificationSystem";
import { Button, Icon } from "./EcoTalaComponents";
import { ECO_ACTIONS, contractCalls } from "../../lib/contract-utils";
import { uploadToIPFS, validatePhotoFile } from "../../lib/photo-utils";

type LogActionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export function LogActionModal({
  isOpen,
  onClose,
  onSuccess,
}: LogActionModalProps) {
  const { address } = useAccount();
  const sendNotification = useNotification();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedAction, setSelectedAction] = useState<string>("");
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [photoHash, setPhotoHash] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [step, setStep] = useState<"select" | "photo" | "confirm" | "submit">(
    "select",
  );

  const selectedActionData = ECO_ACTIONS.find(
    (action) => action.name === selectedAction,
  );

  const handlePhotoSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file
      const validation = validatePhotoFile(file);
      if (!validation.valid) {
        sendNotification({
          title: "Invalid File",
          body: validation.error || "Please select a valid image file",
          type: "error",
        });
        return;
      }
      setIsUploading(true);
      try {
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setPhotoPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to IPFS and get hash
        const uploadResult = await uploadToIPFS(file);

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || "Upload failed");
        }

        setPhotoHash(uploadResult.hash || "");
        setStep("confirm");

        sendNotification({
          title: "Photo Ready! 📸",
          body: uploadResult.hash?.startsWith("local_")
            ? "Photo processed for demo (IPFS integration available)"
            : "Photo uploaded to IPFS and ready for blockchain submission.",
          type: "success",
        });
      } catch (error) {
        console.error("Error processing photo:", error);
        sendNotification({
          title: "Upload Error",
          body: "Failed to process photo. Please try again.",
          type: "error",
        });
      } finally {
        setIsUploading(false);
      }
    },
    [sendNotification],
  );

  const handleSuccess = useCallback(() => {
    sendNotification({
      title: "🎉 Eco-Action Logged Successfully!",
      body: `You earned ${selectedActionData?.points || 0} points for ${selectedAction}. Keep saving the planet!`,
      type: "success",
    });

    // Reset form
    setSelectedAction("");
    setPhotoPreview("");
    setPhotoHash("");
    setStep("select");

    onSuccess?.();
    onClose();
  }, [
    sendNotification,
    selectedAction,
    selectedActionData,
    onSuccess,
    onClose,
  ]);

  const handleError = useCallback(
    (error: unknown) => {
      console.error("Transaction error:", error);
      sendNotification({
        title: "Transaction Failed",
        body: "Failed to log eco-action. Please try again.",
      });
    },
    [sendNotification],
  );

  const resetForm = () => {
    setSelectedAction("");
    setPhotoPreview("");
    setPhotoHash("");
    setStep("select");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--app-card-bg)] rounded-xl shadow-2xl border border-[var(--app-card-border)] w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--app-card-border)]">
          <h2 className="text-xl font-bold text-[var(--app-foreground)]">
            Log Eco-Action
          </h2>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            ✕
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Step 1: Select Action */}
          {step === "select" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[var(--app-foreground)]">
                Choose your eco-action
              </h3>
              <div className="grid gap-3">
                {ECO_ACTIONS.map((action) => (
                  <button
                    key={action.name}
                    onClick={() => {
                      setSelectedAction(action.name);
                      setStep("photo");
                    }}
                    className={`p-4 rounded-lg border transition-all text-left ${
                      selectedAction === action.name
                        ? "border-[var(--app-accent)] bg-[var(--app-accent-light)]"
                        : "border-[var(--app-card-border)] hover:border-[var(--app-accent)] hover:bg-[var(--app-accent-light)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{action.icon}</span>
                        <div>
                          <div className="font-medium text-[var(--app-foreground)]">
                            {action.name}
                          </div>
                          <div className="text-sm text-[var(--app-foreground-muted)]">
                            +{action.points} points
                          </div>
                        </div>
                      </div>
                      <Icon
                        name="arrow-right"
                        size="sm"
                        className="text-[var(--app-accent)]"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Take/Upload Photo */}
          {step === "photo" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep("select")}
                >
                  ← Back
                </Button>
                <h3 className="text-lg font-semibold text-[var(--app-foreground)]">
                  Upload Proof Photo
                </h3>
              </div>

              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2 p-4 bg-[var(--app-accent-light)] rounded-lg">
                  <span className="text-2xl">{selectedActionData?.icon}</span>
                  <span className="font-medium text-[var(--app-foreground)]">
                    {selectedAction}
                  </span>
                </div>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[var(--app-accent)] rounded-lg p-8 cursor-pointer hover:bg-[var(--app-accent-light)] transition-colors"
                >
                  <Icon
                    name="camera"
                    size="lg"
                    className="text-[var(--app-accent)] mx-auto mb-2"
                  />
                  <p className="text-[var(--app-foreground)] font-medium">
                    Take or Upload Photo
                  </p>
                  <p className="text-sm text-[var(--app-foreground-muted)] mt-1">
                    Show proof of your eco-action
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />

                {isUploading && (
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--app-accent)]"></div>
                    <p className="text-sm text-[var(--app-foreground-muted)] mt-2">
                      Processing photo...
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Confirm Photo & Action */}
          {step === "confirm" && photoPreview && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep("photo")}
                >
                  ← Back
                </Button>
                <h3 className="text-lg font-semibold text-[var(--app-foreground)]">
                  Confirm Details
                </h3>
              </div>

              <div className="space-y-4">
                {/* Photo Preview */}
                <div className="text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoPreview}
                    alt="Eco-action proof"
                    className="max-w-full h-48 object-cover rounded-lg mx-auto"
                  />
                </div>

                {/* Action Summary */}
                <div className="bg-[var(--app-accent-light)] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">
                        {selectedActionData?.icon}
                      </span>
                      <div>
                        <div className="font-medium text-[var(--app-foreground)]">
                          {selectedAction}
                        </div>
                        <div className="text-sm text-[var(--app-foreground-muted)]">
                          Reward: +{selectedActionData?.points} points
                        </div>
                      </div>
                    </div>
                    <Icon name="trophy" size="md" className="text-yellow-500" />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="space-y-2">
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => setStep("submit")}
                  >
                    Submit to Blockchain
                  </Button>
                  <p className="text-xs text-center text-[var(--app-foreground-muted)]">
                    This action will be permanently recorded on Base blockchain
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Blockchain Transaction */}
          {step === "submit" && address && photoHash && selectedAction && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[var(--app-foreground)] text-center">
                Submitting to Blockchain...
              </h3>

              <Transaction
                contracts={[contractCalls.logAction(selectedAction, photoHash)]}
                onSuccess={handleSuccess}
                onError={handleError}
              >
                <TransactionButton
                  className="w-full bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-[var(--app-background)]"
                  text="Confirm Transaction"
                />
                <TransactionStatus>
                  <TransactionStatusLabel />
                  <TransactionStatusAction />
                </TransactionStatus>
              </Transaction>

              <div className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep("confirm")}
                >
                  ← Go Back
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
