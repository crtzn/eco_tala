"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useEcoTalaContract } from "../../hooks/useEcoTalaContract";
import { Button, Icon } from "./EcoTalaComponents";
import { useNotification } from "./NotificationSystem";

type ShareFeatureProps = {
  onClose: () => void;
};

type UserData = {
  points: number;
  actions: number;
  rank: string;
  walletAddress: string;
  carbonSaved: number;
  wasteRecycled: number;
};

type ShareTemplate = {
  id: string;
  title: string;
  description: string;
  template: (data: UserData) => string;
  hashtags: string[];
  platform: "twitter" | "facebook" | "instagram" | "linkedin";
  icon: string;
};

export function ShareFeature({ onClose }: ShareFeatureProps) {
  const { address } = useAccount();
  const { userStats } = useEcoTalaContract();
  const addNotification = useNotification();
  const [selectedTemplate, setSelectedTemplate] = useState<string>("points");
  const [customMessage, setCustomMessage] = useState("");

  // User data for sharing
  const userData = {
    points: userStats?.points || 50,
    actions: userStats?.actionCount || 5,
    rank: userStats?.rank || "Eco Warrior",
    walletAddress: address?.slice(0, 6) + "..." + address?.slice(-4),
    carbonSaved: Math.round((userStats?.actionCount || 5) * 2.5), // Estimate CO2 saved
    wasteRecycled: Math.round((userStats?.actionCount || 5) * 1.2), // Estimate waste diverted
  };

  // Share templates
  const shareTemplates: ShareTemplate[] = [
    {
      id: "points",
      title: "Points Achievement",
      description: "Share your total eco-points earned",
      template: (data) =>
        `🌱 I just earned ${data.points} eco-points on EcoTala by taking environmental action! Join me in making the Philippines greener! 💚 #EcoTala #GreenPhilippines #BaseBlockchain`,
      hashtags: [
        "EcoTala",
        "GreenPhilippines",
        "BaseBlockchain",
        "ClimateAction",
      ],
      platform: "twitter",
      icon: "⭐",
    },
    {
      id: "actions",
      title: "Action Count",
      description: "Celebrate your environmental actions",
      template: (data) =>
        `🌿 I've completed ${data.actions} eco-friendly actions on EcoTala! From waste segregation to tree planting, every action counts! 🇵🇭 #EcoTala #EnvironmentalAction #Bayanihan`,
      hashtags: [
        "EcoTala",
        "EnvironmentalAction",
        "Bayanihan",
        "Sustainability",
      ],
      platform: "twitter",
      icon: "🎯",
    },
    {
      id: "rank",
      title: "Eco Rank",
      description: "Show off your eco-warrior status",
      template: (data) =>
        `🏆 Proud to be an "${data.rank}" on EcoTala! Together, we Filipinos are fighting climate change one action at a time! 💪 #EcoTala #EcoWarrior #ClimateAction`,
      hashtags: ["EcoTala", "EcoWarrior", "ClimateAction", "Philippines"],
      platform: "twitter",
      icon: "🏆",
    },
    {
      id: "impact",
      title: "Environmental Impact",
      description: "Share your carbon footprint reduction",
      template: (data) =>
        `🌍 My EcoTala actions have helped save approximately ${data.carbonSaved}kg of CO₂ and diverted ${data.wasteRecycled}kg of waste! Small actions, big impact! 🌱 #EcoTala #CarbonFootprint #WasteReduction`,
      hashtags: [
        "EcoTala",
        "CarbonFootprint",
        "WasteReduction",
        "SustainableLiving",
      ],
      platform: "twitter",
      icon: "🌍",
    },
    {
      id: "community",
      title: "Community Movement",
      description: "Invite others to join the movement",
      template: () =>
        `🇵🇭 Join me and thousands of Filipinos on EcoTala! Together we're making our country cleaner and greener through blockchain-verified eco-actions! Let's show the world what bayanihan can do! 💚 #EcoTala #Bayanihan #GreenPhilippines`,
      hashtags: ["EcoTala", "Bayanihan", "GreenPhilippines", "CommunityAction"],
      platform: "twitter",
      icon: "🤝",
    },
    {
      id: "milestone",
      title: "Personal Milestone",
      description: "Celebrate reaching goals",
      template: (data) =>
        `🎉 Milestone unlocked! I've taken ${data.actions} environmental actions and earned ${data.points} points on EcoTala! Every Filipino can make a difference - join the movement! 🌱 #EcoTala #MilestoneAchieved #EnvironmentalHero`,
      hashtags: [
        "EcoTala",
        "MilestoneAchieved",
        "EnvironmentalHero",
        "GoalReached",
      ],
      platform: "twitter",
      icon: "🎉",
    },
  ];

  const selectedTemplateData = shareTemplates.find(
    (t) => t.id === selectedTemplate,
  );
  const shareMessage =
    customMessage ||
    (selectedTemplateData ? selectedTemplateData.template(userData) : "");

  const handleShare = (platform: string) => {
    const message = encodeURIComponent(shareMessage);
    const url = encodeURIComponent("https://ecotala.app"); // Your app URL

    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${message}&url=${url}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${message}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${message}`;
        break;
      case "copy":
        navigator.clipboard.writeText(shareMessage + " https://ecotala.app");
        addNotification({
          title: "Copied!",
          body: "Share message copied to clipboard",
          type: "success",
        });
        return;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");

    addNotification({
      title: "Shared Successfully! 🎉",
      body: "Thank you for spreading the eco-love!",
      type: "success",
    });
  };

  const handleCustomShare = () => {
    if (!customMessage.trim()) {
      addNotification({
        title: "Message Required",
        body: "Please enter a custom message to share",
        type: "error",
      });
      return;
    }
    handleShare("twitter");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--app-background)] rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[var(--app-foreground)] flex items-center">
            <Icon name="heart" className="mr-3 text-[var(--app-accent)]" />
            Share Your Eco Impact
          </h2>
          <Button variant="ghost" onClick={onClose}>
            ✕
          </Button>
        </div>

        {/* User Stats Preview */}
        <div className="grid grid-cols-4 gap-3 mb-6 p-4 bg-[var(--app-card-bg)] rounded-lg border border-[var(--app-card-border)]">
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--app-accent)]">
              {userData.points}
            </div>
            <div className="text-xs text-[var(--app-foreground-muted)]">
              Points
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--app-accent)]">
              {userData.actions}
            </div>
            <div className="text-xs text-[var(--app-foreground-muted)]">
              Actions
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--app-accent)]">
              {userData.carbonSaved}kg
            </div>
            <div className="text-xs text-[var(--app-foreground-muted)]">
              CO₂ Saved
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--app-accent)]">
              {userData.wasteRecycled}kg
            </div>
            <div className="text-xs text-[var(--app-foreground-muted)]">
              Waste Diverted
            </div>
          </div>
        </div>

        {/* Share Templates */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-[var(--app-foreground)]">
            Choose a Template
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {shareTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  selectedTemplate === template.id
                    ? "border-[var(--app-accent)] bg-[var(--app-accent-light)]"
                    : "border-[var(--app-card-border)] bg-[var(--app-card-bg)] hover:border-[var(--app-accent)]"
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-lg">{template.icon}</span>
                  <span className="font-medium text-[var(--app-foreground)]">
                    {template.title}
                  </span>
                </div>
                <div className="text-xs text-[var(--app-foreground-muted)]">
                  {template.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message Preview */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-[var(--app-foreground)]">
            Preview
          </h3>
          <div className="p-4 bg-[var(--app-card-bg)] rounded-lg border border-[var(--app-card-border)]">
            <div className="text-sm text-[var(--app-foreground)] leading-relaxed">
              {shareMessage}
            </div>
            {selectedTemplateData && (
              <div className="flex flex-wrap gap-1 mt-3">
                {selectedTemplateData.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-[var(--app-accent-light)] text-[var(--app-accent)] px-2 py-1 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Custom Message */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-[var(--app-foreground)]">
            Custom Message (Optional)
          </h3>
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Write your own eco-achievement message..."
            className="w-full p-3 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] placeholder-[var(--app-foreground-muted)] resize-none"
            rows={3}
            maxLength={280}
          />
          <div className="text-xs text-[var(--app-foreground-muted)] mt-1 text-right">
            {customMessage.length}/280 characters
          </div>
        </div>

        {/* Share Buttons */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--app-foreground)]">
            Share On
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="primary"
              className="flex items-center justify-center space-x-2 p-4"
              onClick={() =>
                customMessage ? handleCustomShare() : handleShare("twitter")
              }
            >
              <span className="text-lg">🐦</span>
              <span>Twitter / X</span>
            </Button>

            <Button
              variant="secondary"
              className="flex items-center justify-center space-x-2 p-4"
              onClick={() => handleShare("facebook")}
            >
              <span className="text-lg">📘</span>
              <span>Facebook</span>
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-center space-x-2 p-4"
              onClick={() => handleShare("linkedin")}
            >
              <span className="text-lg">💼</span>
              <span>LinkedIn</span>
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-center space-x-2 p-4"
              onClick={() => handleShare("copy")}
            >
              <span className="text-lg">📋</span>
              <span>Copy Link</span>
            </Button>
          </div>

          {/* Motivation Message */}
          <div className="p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border border-green-200 mt-6">
            <h4 className="font-semibold text-gray-800 mb-2">
              🌟 Spread the Green Movement!
            </h4>
            <p className="text-sm text-gray-700">
              Every share helps more Filipinos discover EcoTala and join our
              environmental mission. Together, we can make the Philippines the
              greenest archipelago in Southeast Asia! 🇵🇭💚
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
