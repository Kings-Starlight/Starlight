export function msToTime(duration: number) {
  var milliseconds = Math.floor(duration % 1000),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor(duration / (1000 * 60 * 60));

  return `${
    hours != 0
      ? `${hours < 10 ? "0" + hours : hours}${hours === 1 ? "hr" : "hrs"}`
      : ""
  } ${
    minutes != 0
      ? `${minutes < 10 ? "0" + minutes : minutes}${
          minutes === 1 ? "min" : "mins"
        }`
      : ""
  } ${seconds != 0 ? `${seconds < 10 ? "0" + seconds : seconds}s` : ""} ${
    milliseconds != 0 ? `${milliseconds}ms` : ""
  }`.trim();
}

export const blue = 0x0251a8,
  red = 0xff0000;

/**
 * for ensuring that what I'm requesting is, infact, defined.
 * https://stackoverflow.com/questions/54738221/typescript-array-find-possibly-undefined
 * @param argument
 * @param message
 * @returns
 */
export function ensure<T>(
  argument: T | undefined | null,
  message: string = "This value was promised to be there."
): T {
  if (argument === undefined || argument === null) {
    throw new TypeError(message);
  }

  return argument;
}

export function interactionType(type: number): string {
  var newType = "unknown";
  switch (type) {
    case 1:
      newType = "ping";
      break;
    case 2:
      newType = "application command";
      break;
    case 3:
      newType = "message component";
      break;
    case 4:
      newType = "autocomplete";
      break;
    case 5:
      newType = "modal submit";
      break;
  }
  return newType;
}
