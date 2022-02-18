$(function(){
    var sliderItems = $('#first-carousel__slides'),
        prevArrow = $('#left-arrow'),
        nextArrow = $('#right-arrow');

    function slidingCarouselOne(items, prev, next) {
        var slides = items.find('.slide'),
            slidesLength = slides.length,
            slideSize = items.find(".slide").width(),
            index = 0,
            threshold = 100,
            allowShift = true,
            posX1 = 0,
            posX2 = 0,
            posInitial,
            posFinal,
            intervalID,
            allowShift = true,
            firstSlide = $(slides[0]).clone();
            lastSlide = $(slides[slidesLength-1]).clone();
        
        items.append(firstSlide)
        items.prepend(lastSlide)

        intervalID = setInterval(()=>{
            shiftSlide(1)
        }, 5000)

        // reset all captions
        $(`.slide .slide-info`).css({"top": "90%", "opacity": "0"})

        // reset the slider with px unit
        items.css("left", `${items.offset().left}px`)

        // mouse 
        items.mousedown(dragStart)
        
        // touch
        sliderItems.on("touchstart", dragStart)
        sliderItems.on("touchmove", dragAction)
        sliderItems.on("touchend", dragEnd)

        // next-prev icons
        prev.click(function () { shiftSlide(-1) });
        next.click(function () { shiftSlide(1) });

        // transition
        sliderItems.on('transitionend MSTransitionEnd webkitTransitionEnd oTransitionEnd',
        checkIndex);

        function dragStart (e) {
            clearInterval(intervalID)

            e = e || window.event;
            e.preventDefault();
            posInitial = items.offset().left;
            
            if (e.type == 'touchstart') {
                posX1 = e.touches[0].clientX;
            } else {
                posX1 = e.clientX;
                document.onmouseup = dragEnd;
                document.onmousemove = dragAction;
            }
        }

        function dragAction (e) {
            e = e || window.event;
            
            if (e.type == 'touchmove') {
                posX2 = posX1 - e.touches[0].clientX;
                posX1 = e.touches[0].clientX;
            } else {
                posX2 = posX1 - e.clientX;
                posX1 = e.clientX;
            }
    
            items.css("left", `${items.offset().left - posX2}px`);
        }

        function dragEnd (e) {
            intervalID = setInterval(()=>{
                shiftSlide(1)
            }, 5000)
            posFinal = items.offset().left;
            if (posFinal - posInitial < -threshold) {
                shiftSlide(1, 'drag');
            } else if (posFinal - posInitial > threshold) {
                shiftSlide(-1, 'drag');
            } else {
                items.css("left", `${posInitial}px`);
            }
            document.onmouseup = null;
            document.onmousemove = null;
        }

        function shiftSlide(dir, action) {
            items.addClass('shifting');
            
            if (allowShift) {

                if (!action) {
                    posInitial = items.offset().left; 
                }
                $(`.slide .slide-info`).css({'top': '90%', 'opacity': '0', 'pointer-events': 'none'});    

                if (dir == 1) {
                    items.css("left", `${posInitial - slideSize}px`);
                    index++;      
                } else if (dir == -1) {
                    items.css("left", `${posInitial + slideSize}px`);
                    index--;      
                }
            };
            allowShift = false;
        }

        function checkIndex (){
            items.removeClass('shifting');
            if (index == -1) {
                items.css("left", `-${(slidesLength * 100)}%`);
                index = slidesLength - 1;
            }
    
            if (index == slidesLength) {
                items.css("left", "-100%");
                index = 0;
            }
            allowShift = true;

            // stop all animations and reset them. initiate animation for the current element
            $(`.slide .slide-info`).stop();
            $(`.slide .slide-info`).css({'top': '90%', 'opacity': '0', 'pointer-events': 'auto'}); 
            $(`.slide:eq(${index+1}) .slide-info`).animate({top: '50%', opacity: '1'}, 700);
        }

        $(window).resize(() => {
            slideSize = items.find(".slide").width();
            items.css("left", `${-100 * (index+1)}%`);
        });
    }

    slidingCarouselOne(sliderItems, prevArrow, nextArrow)
});