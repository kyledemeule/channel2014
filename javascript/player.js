function Player(){}

//attributes
Player.on_deck_images = [];
Player.on_deck_audio = [];

Player.next_image = null;
Player.next_audio = null;

Player.current_channel = -1;

//methods
Player.switch_media = function(){
    if(this.on_deck_images.length == 0) {
        this.prepare_image_list();
    }
    if(this.on_deck_audio.length == 0) {
        this.prepare_audio_list();
    }
    this.next_image = this.on_deck_images.pop();
    this.next_audio = this.on_deck_audio.pop();

    this.switch_image();
    this.switch_audio();
}

Player.prepare_image_list = function() {
    var possible_media = Player.get_possible_media("images");
    //turn them into URLs
    for(var index = 0; index < possible_media.length; index++) {
        possible_media[index] = Config.base_asset_path + Config.image_path + possible_media[index];
    }
    shuffle_array(possible_media);
    this.on_deck_images = possible_media;
}

Player.prepare_audio_list = function() {
    var possible_media = Player.get_possible_media("audio");
    //turn them into URLs
    for(var index = 0; index < possible_media.length; index++) {
        possible_media[index] = Config.base_asset_path + Config.audio_path + possible_media[index];
    }
    shuffle_array(possible_media);
    this.on_deck_audio = possible_media;
}

Player.switch_image = function() {
    document.body.style.backgroundImage = 'url(' + Player.next_image + ')';
}

Player.switch_audio = function() {

}

Player.change_channel = function(channel) {
    var channel = parseInt(channel);
    if(this.invalid_channel(channel)) {
        return;
    }
    this.current_channel = channel;
    this.on_deck_images = [];
    this.on_deck_audio = [];
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
        return Config.channels[type].slice(0);
    } else {
        //if the channel is all, grab the media from each channel
        var media = [];
        for(var index = 0; index < Config.channels.length; index++) {
            media.concat(Config.channel[index][type]);
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