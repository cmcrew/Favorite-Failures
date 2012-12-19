jQuery(document).ready(function ($) {

    //initialise Stellar.js
    $(window).stellar();

    updateCountdown();
    $('.pitch').change(updateCountdown);
    $('.pitch').keyup(updateCountdown);    
    
    //Cache some variables
    var links = $('.navigation').find('li');
    slide = $('.slide');
    button = $('.button');
    mywindow = $(window);
    htmlbody = $('html,body');

    function updateCountdown() {
    // 140 is the max message length
    var remaining = 140 - jQuery('.pitch').val().length;
    jQuery('.countdown').text(remaining);
    }
    

    //Setup waypoints plugin
    slide.waypoint(function (event, direction) {

        //cache the variable of the data-slide attribute associated with each slide
        dataslide = $(this).attr('data-slide');
        moveDirection = direction;
        changeLogoColor();
        checkNavigation();

        //If the user scrolls up change the navigation link that has the same data-slide attribute as the slide to active and 
        //remove the active class from the previous navigation link 
        if (direction === 'down') {
            $('.navigation li[data-slide="' + dataslide + '"]').addClass('active').prev().removeClass('active');
        }
        // else If the user scrolls down change the navigation link that has the same data-slide attribute as the slide to active and 
        //remove the active class from the next navigation link 
        else {
            $('.navigation li[data-slide="' + dataslide + '"]').addClass('active').next().removeClass('active');
        }

    });

    //waypoints doesnt detect the first slide when user scrolls back up to the top so we add this little bit of code, that removes the class 
    //from navigation link slide 2 and adds it to navigation link slide 1. 
    mywindow.scroll(function () {
        if (mywindow.scrollTop() === 0) {
           // $('.navigation li[data-slide="1"]').addClass('active');
            $('.navigation li[data-slide="1"]').removeClass('active');
        }
    });

    //Create a function that will be passed a slide number and then will scroll to that slide using jquerys animate. The Jquery
    //easing plugin is also used, so we passed in the easing method of 'easeInOutQuint' which is available throught the plugin.
    function goToByScroll(dataslide) {
        htmlbody.animate({
            scrollTop: $('.slide[data-slide="' + dataslide + '"]').offset().top
        }, 2000, 'easeInOutQuint');
    }

    //When the user clicks on the navigation links, get the data-slide attribute value of the link and pass that variable to the goToByScroll function
    links.click(function (e) {
        e.preventDefault();
        dataslide = $(this).attr('data-slide');
        goToByScroll(dataslide);
    });

    //When the user clicks on the button, get the data-slide attribute value of the button and pass that variable to the goToByScroll function
    button.click(function (e) {
        e.preventDefault();
        dataslide = $(this).attr('data-slide');
        goToByScroll(dataslide);

    });
    
    //function to change color of logo from light to dark on slide 3
    function changeLogoColor() {
        var logo = $('.razorfishlogo');
        if((dataslide === '2' && moveDirection === 'up') || (dataslide === '2' && moveDirection === 'down')) {
            //fade out logo and fade in new logo
            $('.razorfishlogo').fadeOut('fast', function() {
                $(this).load(function() { $(this).fadeIn();});
                $(this).attr('src', 'images/rflogodark.png');
            });
        }
        else if ($('.razorfishlogo').attr('src') === 'images/rflogodark.png') {
            $('.razorfishlogo').fadeOut('fast', function() {
                $(this).load(function() {$(this).fadeIn(); });
                $(this).attr('src', 'images/rflogo.png');
            });
        }
    }
    
    function checkNavigation() {
        if(dataslide !== '0') {
            $('.navigation li').show();
        }
        else {
            $('.navigation li').hide();
        }
    }

});