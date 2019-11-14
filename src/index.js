import React from "react";

import PWAPrompt from "./components/PWAPrompt";

const deviceCheck = () => {
  const isiOS = /iphone|ipad|ipod/.test(
    window.navigator.userAgent.toLowerCase()
  );
  const isiPadOS =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  const isStandalone =
    "standalone" in window.navigator && window.navigator.standalone;

  return (isiOS || isiPadOS) && !isStandalone;
};

export default ({
  timesToShow = 1,
  promptOnVisit = 1,
  doNotShowDays = 60,
  permanentlyHideOnDismiss = true,
  copyTitle = "Add to Home Screen",
  copyBody = "This website has app functionality. Add it to your home screen to use it in fullscreen and while offline.",
  copyBodyNonSafari = "This website has app functionality. Please open this url in Safari and add it to your home screen to use it in full screen and while offline.",
  copyShareButtonLabel = "1) Press the 'Share' button",
  copyAddHomeButtonLabel = "2) Press 'Add to Home Screen'",
  copyDoNotShowCheckbox = "Do not show for next 60 days",
  copyClosePrompt = "Cancel",
  delay = 1000
}) => {
  let promptData = JSON.parse(localStorage.getItem("iosPwaPrompt"));

  if (promptData === null) {
    promptData = { isiOS: deviceCheck(), visits: 0, doNotShowUntil: 0 };
    localStorage.setItem("iosPwaPrompt", JSON.stringify(promptData));
  }

  if (promptData.isiOS) {
    const aboveMinVisits = promptData.visits + 1 >= promptOnVisit;
    const belowMaxVisits = promptData.visits + 1 < promptOnVisit + timesToShow;

    const doNotShowMiliseconds = doNotShowDays * 24 * 60 * 60 * 1000;
    const now = Date.now();

    const expireDate = now + doNotShowMiliseconds;

    if (belowMaxVisits) {
      localStorage.setItem(
        "iosPwaPrompt",
        JSON.stringify({
          ...promptData,
          visits: promptData.visits + 1
        })
      );

      if (aboveMinVisits && (now > promptData.doNotShowUntil)) {
        return (
          <PWAPrompt
            delay={delay}
            copyTitle={copyTitle}
            copyBody={copyBody}
            copyBodyNonSafari={copyBodyNonSafari}
            copyAddHomeButtonLabel={copyAddHomeButtonLabel}
            copyShareButtonLabel={copyShareButtonLabel}
            copyClosePrompt={copyClosePrompt}
            permanentlyHideOnDismiss={permanentlyHideOnDismiss}
            copyDoNotShowCheckbox ={copyDoNotShowCheckbox}
            doNotShowDays={doNotShowDays}
            expireDate={expireDate}
            promptData={promptData}
            maxVisits={timesToShow + promptOnVisit}
          />
        );
      }
    }
  }

  return null;
};
