export function msToTime(duration: number) {
    var milliseconds = Math.floor(duration % 1000),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

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
    }`;
}
