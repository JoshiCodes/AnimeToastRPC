const debug = true;

const presence = new Presence({
        clientId: "870310829436829696" //The client ID of the Application created at https://discordapp.com/developers/applications
    }),
    strings = presence.getStrings({
        play: "presence.playback.playing",
        pause: "presence.playback.paused"
        //You can use this to get translated strings in their browser language
    });

const start = Math.floor(Date.now() /1000);

let anime: string = null;
let episode: string = null;
let url: string = null;
let cover: HTMLImageElement = null;
let buttons: [ButtonData, ButtonData?];

function getElements(){

    let animeName = (document.getElementsByClassName("title-info")[0] as HTMLDivElement);
    if(animeName != null) {
        animeName = animeName.getElementsByClassName("light-title entry-title")[0] as HTMLHeadingElement;
        
        if(animeName != null) {
            anime = animeName.textContent;
        } else if(anime != null) {
            anime = null;
        }

    }

    let episodeName = (document.getElementsByClassName("current-link")[0] as HTMLLinkElement);
    if(animeName != null && episodeName != null) {
        episode = episodeName.textContent;
    } else {
        if(document.querySelector("#multi_link_tab0") == null && anime != null) {
            episode = "Noch keine Folge vorhanden.";
        } else episodeName = null;
    }
    
    cover = document.querySelector("img.size-full");

    url = window.location.href;

    if(animeName != null) {
        buttons = [new class implements ButtonData {
            label: string = "Anschauen";
            url:string = (url != null ? url : "https://animetoast.cc");
          }];
    } else buttons = [new class implements ButtonData {
        label: string = "Anime suchen";
        url:string = "https://animetoast.cc";
      }];

      if(debug) {
        console.log("anime: " + anime);
        console.log("ep: " + episode);
        console.log("url : " + url)
        console.log("cover: " + cover.src);
      }

}

getElements();
setInterval(getElements, 10000);
//Run the function separate from the UpdateData event every 10 seconds to get and set the variables which UpdateData picks up


presence.on("UpdateData", async () => {
    /*UpdateData is always firing, and therefore should be used as your refresh cycle, or `tick`. This is called several times a second where possible.

      It is recommended to set up another function outside of this event function which will change variable values and do the heavy lifting if you call data from an API.*/

    let detailsString = "Stöbert durch Animes";
    if(anime != null) {
        detailsString = anime;
    }

    let state = "";
    if(episode != null) {
        state = episode;
    }

    const presenceData: PresenceData = {
        largeImageKey: (cover != null && anime != null) ? 
            cover.src
        :"devil" , /*The key (file name) of the Large Image on the presence. These are uploaded and named in the Rich Presence section of your application, called Art Assets*/
        //smallImageKey:
            //"devil" /*The key (file name) of the Small Image on the presence. These are uploaded and named in the Rich Presence section of your application, called Art Assets*/,
        //smallImageText: "Some hover text", //The text which is displayed when hovering over the small image
        details: detailsString, //The upper section of the presence text
        state: state, //The lower section of the presence text
        startTimestamp: start, //The unix epoch timestamp for when to start counting from
        //endTimestamp: 1577151472000 //If you want to show Time Left instead of Elapsed, this is the unix epoch timestamp at which the timer ends
        buttons: buttons
        
    }; /*Optionally you can set a largeImageKey here and change the rest as variable subproperties, for example presenceSata.type = "blahblah"; type examples: details, state, etc.*/

    if (presenceData.details != null) presence.setActivity(presenceData);
  //Update the presence with no data, therefore clearing it and making the large image the Discord Application icon, and the text the Discord Application name
    else presence.setActivity();

});