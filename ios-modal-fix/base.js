$(function() {
    var $window = $(window),
        $body = $("body"),
        $modal = $(".modal"),
        scrollDistance = 0;

    $modal.on("show.bs.modal", function() {
        scrollDistance = $window.scrollTop();

        $body.css("top", scrollDistance * -1);
    });

    $modal.on("hidden.bs.modal", function() {
        $body.css("top", "");
        $window.scrollTop(scrollDistance);  
    });
});