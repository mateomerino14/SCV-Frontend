const viewportMargin = 12;
const menuGap = 4;
const minimumListHeight = 96;

const spaceBelow = (trigger, reservedHeight) => {
  const rect = trigger.getBoundingClientRect();
  return window.innerHeight - rect.bottom - menuGap - viewportMargin - reservedHeight;
};

export const makeRoomBelow = (trigger, reservedHeight = 0) => {
  if (spaceBelow(trigger, reservedHeight) < minimumListHeight) {
    trigger.scrollIntoView({block: 'center'});
  }
};

export const listHeightBelow = (trigger, preferredHeight, reservedHeight = 0) => {
  return Math.max(minimumListHeight, Math.min(preferredHeight, spaceBelow(trigger, reservedHeight)));
};

export const menuTopBelow = (trigger) => trigger.getBoundingClientRect().bottom + menuGap;
