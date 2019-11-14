import React, { Fragment, useEffect, useState, useRef } from "react";

import ShareIcon from "./ShareIcon";
import HomeScreenIcon from "./HomeScreenIcon";

import styles from "./PWAPrompt.styles.scss";

const PWAPrompt = ({
  delay,
  copyTitle,
  copyBody,
  copyBodyNonSafari,
  copyAddHomeButtonLabel,
  copyShareButtonLabel,
  copyDoNotShowCheckbox,
  copyClosePrompt,
  permanentlyHideOnDismiss,
  doNotShowDays,
  promptData,
  expireDate,
  maxVisits
}) => {
  const [isVisible, setVisibility] = useState(!Boolean(delay));

  useEffect(() => {
    if (delay) {
      setTimeout(() => setVisibility(true), delay);
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      document.body.classList.add(styles.noScroll);
    }
  }, [isVisible]);

  const isiOS13 = /OS 13/.test(window.navigator.userAgent);
  const visibilityClass = isVisible ? styles.visible : styles.hidden;
  const iOSClass = isiOS13 ? styles.modern : "legacy";
  const isNonSafari = /FxiOS/.test(window.navigator.userAgent) || /CriOS/.test(window.navigator.userAgent) || /EdgiOS/.test(window.navigator.userAgent);

  const displayCopyBody = isNonSafari ? copyBodyNonSafari : copyBody;

  const checkboxDoNotShowEl = useRef(null);

  const dismissPrompt = () => {
    document.body.classList.remove(styles.noScroll);
    setVisibility(false);
    console.log('checkbox value: ');
    console.log(checkboxDoNotShowEl.current.checked);
    if (permanentlyHideOnDismiss) {
      localStorage.setItem(
        "iosPwaPrompt",
        JSON.stringify({
          ...promptData,
          visits: promp,
        })
      );
    }
    const doNotShowPrompt = checkboxDoNotShowEl.current.checked;
    if (doNotShowPrompt) {
      localStorage.setItem(
        "iosPwaPrompt",
        JSON.stringify({
          ...promptData,
          doNotShowUntil: expireDate
        })
      );
    }
  };

  const onTransitionOut = evt => {
    if (!isVisible) {
      evt.currentTarget.style.display = "none";
    }
  };

  return (
    <Fragment>
      <div
        className={`${styles.pwaPromptOverlay} ${visibilityClass} ${iOSClass}`}
        aria-label="Close"
        role="button"
        onClick={dismissPrompt}
        onTransitionEnd={onTransitionOut}
      />
      <div
        className={`${styles.pwaPrompt} ${visibilityClass} ${iOSClass}`}
        aria-describedby="pwa-prompt-description"
        aria-labelledby="pwa-prompt-title"
        role="dialog"
        onTransitionEnd={onTransitionOut}
      >
        <div className={styles.pwaPromptHeader}>
          <p id="pwa-prompt-title" className={styles.pwaPromptTitle}>
            {copyTitle}
          </p>
          <button className={styles.pwaPromptCancel} onClick={dismissPrompt}>
            {copyClosePrompt}
          </button>
        </div>
        <div className={styles.pwaPromptBody}>
          <div className={styles.pwaPromptDescription}>
            <p id="pwa-prompt-description" className={styles.pwaPromptCopy}>
              {displayCopyBody}
            </p>
            {doNotShowDays && 
            <p className={styles.pwaPromptCheckboxWrapper}><input className={styles.pwaPromptCheckbox} ref={checkboxDoNotShowEl} id="checkboxDays" type="checkbox" value={doNotShowDays} /><label className={styles.pwaPromptCheckboxLabel} htmlFor="checkboxDays">{copyDoNotShowCheckbox}</label></p>}
          </div>
        </div>
        <div className={styles.pwaPromptInstruction}>
          <div className={styles.pwaPromptInstructionStep}>
            <ShareIcon className={styles.pwaPromptShareIcon} modern={isiOS13} />
            <p className={`${styles.pwaPromptCopy} ${styles.bold}`}>
              {copyShareButtonLabel}
            </p>
          </div>
          <div className={styles.pwaPromptInstructionStep}>
            <HomeScreenIcon
              className={styles.pwaPromptHomeIcon}
              modern={isiOS13}
            />
            <p className={`${styles.pwaPromptCopy} ${styles.bold}`}>
              {copyAddHomeButtonLabel}
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PWAPrompt;
