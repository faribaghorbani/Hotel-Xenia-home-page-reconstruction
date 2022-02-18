var sliderItemsTwo = document.getElementById('second-carousel__slides'),
    indicatorsTwo = Array.from(document.querySelectorAll('.second-carousel .indicators__dot span')),
    sliderItemsThree = document.getElementById('third-carousel__slides'),
    indicatorsThree = Array.from(document.querySelectorAll('.third-carousel .indicators__dot span'));

function slide(items, indicators) {
    var posX1 = 0,
        posX2 = 0,
        posInitial,
        posFinal,
        threshold = 100,
        slides = items.getElementsByClassName('slide'),
        slidesLength = slides.length,
        slideSize = items.getElementsByClassName('slide')[0].offsetWidth,
        firstSlide = slides[0],
        lastSlide = slides[slidesLength - 1],
        cloneFirst = firstSlide.cloneNode(true),
        cloneLast = lastSlide.cloneNode(true),
        index = 0,
        allowShift = true,
        intervalID,
        indicatorDotColor = "#d6d6d6",
        indicatorDotSelectedColor = "#869791";

    // Clone first and last slide
    items.appendChild(cloneFirst);
    items.insertBefore(cloneLast, firstSlide);

    items.style.left = items.offsetLeft + "px";

    // automate sliding
    intervalID = setInterval(()=>{
        shiftSlide(1)
    }, 4000)
  
    // Mouse events
    items.onmousedown = dragStart;
  
    // Touch events
    items.addEventListener('touchstart', dragStart);
    items.addEventListener('touchend', dragEnd);
    items.addEventListener('touchmove', dragAction);
  
  
    // Transition events
    items.addEventListener('transitionend', checkIndex);
  
    function dragStart (e) {
        clearInterval(intervalID)
        e = e || window.event;
        e.preventDefault();
        posInitial = items.offsetLeft;
        
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
        items.style.left = (items.offsetLeft - posX2) + "px";
    }
  
    function dragEnd (e) {
        intervalID = setInterval(()=>{
            shiftSlide(1)
        }, 4000)

        posFinal = items.offsetLeft;
        if (posFinal - posInitial < -threshold) {
            shiftSlide(1, 'drag');
        } else if (posFinal - posInitial > threshold) {
            shiftSlide(-1, 'drag');
        } else {
            items.style.left = (posInitial) + "px";
        }

        document.onmouseup = null;
        document.onmousemove = null;
    }
  
    function shiftSlide(dir, action) {
        items.classList.add('shifting');
        
        if (allowShift) {
            if (!action) {
                posInitial = items.offsetLeft; 
            }

            if (dir == 1) {
                items.style.left = (posInitial - slideSize) + "px";
                index++;      
            } else if (dir == -1) {
                items.style.left = (posInitial + slideSize) + "px";
                index--;      
            }
        };
        allowShift = false;

        indicatorCheck(index)
    }
    
    // loop handling
    function checkIndex (){
        items.classList.remove('shifting');

        if (index == -1) {
            items.style.left = `-${(slidesLength * 100)}%`;
            index = slidesLength - 1;
        }

        if (index == slidesLength) {
            items.style.left = "-100%";
            index = 0;
        }
        allowShift = true;
        indicatorCheck(index)
    }

    
    // check the selected indicator
    function indicatorCheck(index) {
        indicators.forEach((indicator, indexOfIndicator)=>{
            if (index == indexOfIndicator) {
                indicator.style.backgroundColor = indicatorDotSelectedColor;
            } else {
                indicator.style.backgroundColor = indicatorDotColor;
            }
        })
    }

    // check first indicatpr color when the document is loaded
    indicatorCheck(index);

    // hover on indicators
    indicators.forEach((indicator, indexOfIndicator) => {
        indicator.addEventListener("mouseover", function(){
            this.style.backgroundColor = indicatorDotSelectedColor;
        });
        indicator.addEventListener("mouseleave", function(){
            this.style.backgroundColor = indicatorDotColor;
        });
        indicator.addEventListener("click", function(){
            items.classList.add('shifting');
            index = indexOfIndicator;
            items.style.left = `-${(index+1)* 100}%`;
            indicatorCheck(index);
        });
        
    })
    
    // resize handling
    window.addEventListener('resize', () => {
        slideSize = items.getElementsByClassName('slide')[0].offsetWidth;
        items.style.left = `${-100 * (index+1)}%`;
    });
    
}

slide(sliderItemsTwo, indicatorsTwo);
slide(sliderItemsThree, indicatorsThree);
