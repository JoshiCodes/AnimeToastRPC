const debug = true;
const presence = new Presence({
    clientId: "870310829436829696"
}), strings = presence.getStrings({
    play: "presence.playback.playing",
    pause: "presence.playback.paused"
});
const start = Math.floor(Date.now() / 1000);
let anime = null;
let episode = null;
let url = null;
let cover = null;
let buttons;
function getElements() {
    let animeName = document.getElementsByClassName("title-info")[0];
    if (animeName != null) {
        animeName = animeName.getElementsByClassName("light-title entry-title")[0];
        if (animeName != null) {
            anime = animeName.textContent;
        }
        else if (anime != null) {
            anime = null;
        }
    }
    let episodeName = document.getElementsByClassName("current-link")[0];
    if (animeName != null && episodeName != null) {
        episode = episodeName.textContent;
    }
    else {
        if (document.querySelector("#multi_link_tab0") == null && anime != null) {
            episode = "Noch keine Folge vorhanden.";
        }
        else
            episodeName = null;
    }
    cover = document.querySelector("img.size-full");
    url = window.location.href;
    if (animeName != null) {
        buttons = [new class {
                constructor() {
                    this.label = "Anschauen";
                    this.url = (url != null ? url : "https://animetoast.com");
                }
            }];
    }
    else
        buttons = [new class {
                constructor() {
                    this.label = "Anime suchen";
                    this.url = "https://animetoast.com";
                }
            }];
    if (debug) {
        console.log("anime: " + anime);
        console.log("ep: " + episode);
        console.log("url : " + url);
        console.log("cover: " + cover.src);
    }
}
getElements();
setInterval(getElements, 10000);
presence.on("UpdateData", async () => {
    let detailsString = "Stöbert durch Animes";
    if (anime != null) {
        detailsString = anime;
    }
    let state = "";
    if (episode != null) {
        state = episode;
    }
    const presenceData = {
        largeImageKey: (cover != null && anime != null) ?
            cover.src
            : "devil",
        details: detailsString,
        state: state,
        startTimestamp: start,
        buttons: buttons
    };
    if (presenceData.details != null)
        presence.setActivity(presenceData);
    else
        presence.setActivity();
});
