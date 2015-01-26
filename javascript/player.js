function Player(){}

//attributes
Player.on_deck_videos = [];
Player.next_video = null;
Player.current_channel = -1;

//methods
Player.switch_media = function(){
    if(this.on_deck_videos.length == 0) {
        this.prepare_video_list();
    }
    this.next_video = this.on_deck_videos.pop();
    this.switch_video(this.next_video);
}

Player.prepare_video_list = function() {
    var possible_media = Player.get_possible_media("videos");
    shuffle_array(possible_media);
    this.on_deck_videos = possible_media;
}

Player.switch_media_lazy = function(video_url) {
    var temp_video = document.getElementById("bgvideo");
    var self = this;
    temp_video.onload = function(){
        document.body.style.backgroundImage = 'url(' + video_url + ')';
    };
    temp_video.src = video_url;
}

Player.switch_video = function(video_files) {
    var base_path = Config.base_asset_path + Config.video_path;
    var video_element = document.getElementById("bgvideo");
    if(Modernizr.video && Modernizr.video.h264) {
        video_element.setAttribute("src", base_path + video_files.h264);
    } else if(Modernizr.video && Modernizr.video.webm) {
        video_element.setAttribute("src", base_path + video_files.webm);
    } else if(Modernizr.video && Modernizr.video.ogg) {
        video_element.setAttribute("src", base_path + video_files.ogg);
    }
}

Player.toggle_video = function() {
    var video = document.getElementById("bgvideo");
    if(video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

Player.change_channel = function(channel) {
    var channel = parseInt(channel);
    if(this.invalid_channel(channel)) {
        return;
    }
    this.current_channel = channel;
    this.on_deck_videos = [];
    this.switch_media();

}

function shuffle_array(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

Player.get_possible_media = function(type) {
    if(Player.current_channel != -1) {
        return Config.channels[Player.current_channel][type].slice(0);
    } else {
        //if the channel is all, grab the media from each channel
        var media = [];
        for(var index = 0; index < Config.channels.length; index++) {
            media = media.concat(Config.channels[index][type]);
        }
        return media;
    }
}

Player.invalid_channel = function(channel) {
    if (Config.channels.length == 0 ||
        channel > Config.channels.length + 1 ||
        channel < -1) {
        return true;
    } else {
        return false;
    }
}
