let currentsong = new Audio();
let songs;
let currfolder;
function convertSecondsToFormattedTime(seconds) {
    const roundedSeconds = Math.round(seconds);
    const mins = Math.floor(roundedSeconds / 60);
    const secs = roundedSeconds % 60;
    const formattedMinutes = String(mins).padStart(2, '0');
    const formattedSeconds = String(secs).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

//Get songs From selected folder
async function getsongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/Songs/${folder}/`);

    let b = await a.text();
    let div = document.createElement("div")
    div.innerHTML = b;

    let as = div.getElementsByTagName("a");
    songs = []
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {

            songs.push(element.href.split("500")[1])
        }

    }
    let songul = document.querySelector(".playcard").getElementsByTagName("ul")[0];
    songul.innerHTML = ""
    // console.log(songul)
    for (const songlist of songs) {
        // console.log(songlist)
        songul.innerHTML = songul.innerHTML + `<li> <img src="/svg/music.svg" alt=""><div style="
    word-wrap: break-word;
    overflow: hidden;">${songlist.split(`/Songs/${folder}/`)[1].replaceAll("%20", " ")}</div></li>`
    }
    let songname = document.querySelector(".control").getElementsByTagName("p")[0];
    Array.from(document.querySelector(".playcard").getElementsByTagName("li")).forEach(e => {

        e.addEventListener("click", element => {
            // console.log(e.getElementsByTagName("div")[0].innerHTML)
            let one = e.getElementsByTagName("div")[0].innerHTML;
            let two = `Songs/${folder}/`;
            playmusic(two + one);
            play.src = "/svg/playcontrol.svg"
            songname.innerHTML = one;
        })
      

    })
    return songs;
}
playmusic = (song) => {
    currentsong.src = song;
    currentsong.play();

    // console.log(song)


}
function Timestamp() {
    let timestamp = document.querySelector(".control").getElementsByTagName("p")[1];
    const seekbar = document.querySelector(".seekbar");
    const dot = document.querySelector(".dot");
    const line = document.querySelector(".line");

    function updateUI() {
        const currentTime = currentsong.currentTime;
        const duration = currentsong.duration;

        if (duration > 0) {
            const percent = (currentTime / duration) * 100;
            timestamp.innerHTML = `${convertSecondsToFormattedTime(currentTime)} / ${convertSecondsToFormattedTime(duration)}`;
            dot.style.left = percent + "%";
            line.style.width = percent + "%";
        }
    }

    currentsong.addEventListener("timeupdate", updateUI);


    seekbar.addEventListener("click", (e) => {
        const seekbarRect = seekbar.getBoundingClientRect();
        const offsetX = e.clientX - seekbarRect.left;
        const percent = offsetX / seekbarRect.width;
        currentsong.currentTime = percent * currentsong.duration;
    });


    updateUI();
}







async function main() {

    // Get songs from local server
    await getsongs("rj");

    document.querySelector(".hamburger").addEventListener("click", ele => {
        document.querySelector(".left").style.left = 0;
    })
    document.querySelector(".cross").addEventListener("click", ele => {
        document.querySelector(".left").style.left = -100 + "%";
    })








    //Play pause and next

    play.addEventListener("click", e => {
        if (currentsong.paused) {
            play.src = "/svg/playcontrol.svg";
            currentsong.play();
        }
        else {
            currentsong.pause();
            play.src = "/svg/pause.svg";
        }


    })
    let volume = document.querySelector(".vol").getElementsByTagName("input")[0];
    volume.addEventListener("change", e => {
        let v = (e.target.value) / 100;
        currentsong.volume = v;
        let im = document.querySelector(".vol").getElementsByTagName("img")[0];
        if (v == 0) {
            im.src = "/svg/mute.svg";
        }
        else {
            im.src = "/svg/volume.svg";
        }
    })
    let mutevol = document.querySelector(".vol").getElementsByTagName("img")[0];

    mutevol.addEventListener("click", e => {
        mutevol.src = "/svg/mute.svg";
        volume.value = 0;
        currentsong.volume = 0;
    })











    //next and previous


    // console.log(currentsong.src)
    let songname = document.querySelector(".control").getElementsByTagName("p")[0];
    function songpath(path) {
        let upcomingsong = path.getElementsByTagName("div")[0].innerHTML.replace(" ", "%20");
        currentsong.src = `http://127.0.0.1:5500/Songs/${currfolder}/` + upcomingsong;
        currentsong.play();
        songname.innerHTML = upcomingsong.replace("%20", " ");
    }



    let next = document.querySelector(".con").getElementsByTagName("img")[2];
    next.addEventListener("click", e => {

        for (let i = 0; i < songs.length; i++) {
            let b = document.querySelector(".playcard").getElementsByTagName("li")[i].getElementsByTagName("div")[0].innerHTML;
            let sname = currentsong.src.split(`Songs/${currfolder}/`)[1].replaceAll("%20", " ")
            if (b == sname) {
                if (i + 1 < songs.length) {
                    currentsong.pause();
                    play.src = "/svg/playcontrol.svg";
                    songpath(document.querySelector(".playcard").getElementsByTagName("li")[i + 1]);
                    break;
                }
                else {
                    songpath(document.querySelector(".playcard").getElementsByTagName("li")[0]);
                    break;
                }
            }
        }
    })






    let previous = document.querySelector(".con").getElementsByTagName("img")[0];
    previous.addEventListener("click", e => {
        for (let i = 0; i < songs.length; i++) {
            let b = document.querySelector(".playcard").getElementsByTagName("li")[i].getElementsByTagName("div")[0].innerHTML;
            let sname = currentsong.src.split(`Songs/${currfolder}/`)[1].replaceAll("%20", " ")

            if (b == sname) {
                if (i > 0) {
                    songpath(document.querySelector(".playcard").getElementsByTagName("li")[i - 1]);
                    break;
                }
                else {
                    songpath(document.querySelector(".playcard").getElementsByTagName("li")[songs.length - 1]);
                    break;
                }
            }
        }
    })






    async function albums() {
       
            let link = await fetch("http://127.0.0.1:5500/Songs/");
            let text = await link.text();
            let albumdiv = document.createElement("div");
            albumdiv.innerHTML = text;
            let as = albumdiv.getElementsByTagName("a");
            // console.log(text);
            // console.log(as);

            let anchorarr = Array.from(as);
            
            anchorarr.forEach(async e => {
                if (e.href.includes("/Songs/")) {
                    let folder2 = e.href.split("/Songs/")[1];
                    // console.log(e)
                    e.dataset.currfolder = folder2;
                    
                    let infolink = await fetch(`http://127.0.0.1:5500/Songs/${folder2}/info.json`);
                    let result = await infolink.json();
                    
                    let cardshtml = document.querySelector(".cardscontainer");
                    cardshtml.innerHTML =cardshtml.innerHTML + `
                        <div class="cards" data-folder="${folder2}">
                            <div class="cardinfo">
                                <img src="/Songs/${folder2}/cover.jpg" alt="">
                                <img class="playbtn" src="/svg/play.svg" alt="">
                                <h1 style="font-size:12px">${result.Title}</h1>
                                <p style="margin: 0; color: white; width: 256px;height:25px; font-size: 10px;">${result.Description}</p>
                            </div>
                        </div>
                    `;
                    
                    Array.from(document.getElementsByClassName("cards")).forEach(e => { 
                        e.addEventListener("click", async item => {
                            console.log("Fetching Songs")
                            songs = await getsongs(`${item.currentTarget.dataset.folder}`) 
                            currentsong.pause();
                    play.src = "/svg/playcontrol.svg"; 
                            playmusic(songs[0])
                            songname.innerHTML = songs[0].split(`/Songs/${currfolder}/`)[1].replaceAll("%20", " ");


                
                        })
                    })
                }
            });
        
    }
    
    Timestamp();
    albums();
}


main();