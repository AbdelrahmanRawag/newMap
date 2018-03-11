var locationModel = function (reslocation) {
    this.title = reslocation.title;
    this.location = reslocation.location;
    this.marker = reslocation.marker;
    this.content = reslocation.content;
};


var data = [
    {title: "Mac", location: {lat: 29.994099, lng: 31.160268}},
    {title: "Hardeees", location: {lat: 29.994319, lng: 31.160842}},
    {title: "Spectra", location: {lat: 29.993899, lng: 31.160767}},
    {title: "Marhaba", location: {lat: 29.995760, lng: 31.159295}},
    {title: "PizzaHut", location: {lat: 29.993827, lng: 31.159313}}
];
var map;
var content;

function LocationViewModel() {
    /** Here We are going to define Some Variables .*/

    var self = this;
    this.resturant = ko.observable("Resturants");
    this.searchtext = ko.observable("");
    console.log(this.searchtext());
    this.list = ko.observableArray([]);
    this.list.push(new locationModel({title: "Resturants", location: null, marker: null}));
    this.newlist = ko.computed(function () {

        if (!self.searchtext()) {
            showall(self.list());
            return self.list();
        }
        else {
            var i = 0;
            try {
                content.close();
            }catch (e){
                console.log(e);
            }
            self.resturant("Resturants");
            return ko.utils.arrayFilter(self.list(),
                function (index) {
                    if (i !== 0) {

                        if (!index.title.indexOf(self.searchtext())) {
                            index.marker.setMap(map);
                            return index;
                        }
                        else {
                            index.marker.setMap(null);
                        }
                    }
                    i++;
                }
            );
        }
    });
    data.forEach(function (index) {
        var marker = new google.maps.Marker({
            position: index.location,
            map: map,
            title: index.title
        });
        index.marker = marker;
        index.marker.addListener('click', function () {
            showitem(self.list(), index);
            self.resturant(index.title);

        });
        var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + index.title +
            '&format=json&callback=wikiCallback';
        $.ajax({
            url: wikiUrl,
            dataType: 'jsonp'
        }).done(function (response) {
            var articleresponse = response[1];
            for (var i = 0; i < articleresponse.length; i++) {
                var articleStr = articleresponse[i];
                var url =
                    'https://www.wikipedia.org/wiki/' +
                    articleStr;
                index.content =
                    '<div><h3>' +
                    index.title +
                    '</h3><p>Wiki Info: <a href="' +
                    url + '">' + articleStr +
                    '</a></p></div>';
            }
            // if()
            self.list.push(new locationModel(index));

        }).fail(function () {
            index.content = "<p>Failed To load The Data</p>";
            self.list.push(new locationModel(index));

        });


    });

    this.clicklocation = function (location) {
        console.log(location.content);
        if (location.title == "Resturants") {
            console.log("showAll");
            showall(self.list());
            content.close();
            self.resturant(location.title);
        }
        else {
            console.log("showITEM");
            showitem(self.list(), location);
            self.resturant(location.title);

        }
    };
}

function showall(list) {
    var i = 0;
    try {
        content.close();
    }catch (e){
        console.log(e);
    }
    list.forEach(function (location) {
        if (i !== 0) {

            location.marker.setMap(map);
            location.marker.setVisible(true);
            location.marker.setAnimation(google.maps.Animation.DROP);
            //BOUNCE
        }
        i++;
    });
}

function showitem(list, item) {
    content.setContent(item.content);
    content.open(map, item.marker);
    var i = 0;
    list.forEach(function (location) {
        if (i !== 0) {
            if (item.title === location.title) {
                location.marker.setVisible(true);
                location.marker.setAnimation(google.maps.Animation.BOUNCE);
            }
            else {
                location.marker.setAnimation(null);
            }
        }
        i++;
    });
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: data[0].location
    });
    var locationmiewmodel = new LocationViewModel();
    content = new google.maps.InfoWindow();
    ko.applyBindings(locationmiewmodel);
    console.log("initFunctino");
}
