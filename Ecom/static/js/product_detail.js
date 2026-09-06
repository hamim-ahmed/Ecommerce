/*
=========================================================
PRODUCT DETAILS JAVASCRIPT
=========================================================

Handles:

    1. Product image gallery
    2. Thumbnail selection
    3. Previous / Next buttons
    4. Automatic image sliding
    5. Add To Cart

IMPORTANT:

This file is a STATIC JavaScript file.

Therefore:

    DO NOT use Django template tags here.

Instead, image URLs are read from the HTML
data-image attributes.
=========================================================
*/


/* =====================================================
   PRODUCT IMAGE GALLERY
   ===================================================== */


/*
---------------------------------------------------------
Gallery Elements
---------------------------------------------------------
*/

const mainGalleryImage =
    document.getElementById(
        'product-main-image'
    );


const galleryThumbnails =
    document.querySelectorAll(
        '.gallery-thumbnail'
    );


const galleryPreviousButton =
    document.getElementById(
        'gallery-prev'
    );


const galleryNextButton =
    document.getElementById(
        'gallery-next'
    );


/*
---------------------------------------------------------
Build Image List From HTML
---------------------------------------------------------

The HTML already contains:

    data-image="..."

for every thumbnail.

We read those values here.

This is important because this file is
a static JavaScript file and therefore
cannot contain Django template syntax.
---------------------------------------------------------
*/

const productGalleryImages = [];


galleryThumbnails.forEach(
    function(thumbnail) {

        const imageUrl =
            thumbnail.getAttribute(
                'data-image'
            );


        if (imageUrl) {

            productGalleryImages.push(
                imageUrl
            );

        }

    }
);



/*
---------------------------------------------------------
Current Image
---------------------------------------------------------

0 = main product image
---------------------------------------------------------
*/

let currentGalleryIndex = 0;



/*
=========================================================
SHOW GALLERY IMAGE
=========================================================
*/


function showGalleryImage(
    index
) {


    /*
    -----------------------------------------------------
    Make sure we actually have images
    -----------------------------------------------------
    */

    if (
        productGalleryImages.length === 0
    ) {

        return;

    }


    /*
    -----------------------------------------------------
    Loop to last image
    -----------------------------------------------------
    */

    if (
        index < 0
    ) {

        index =
            productGalleryImages.length - 1;

    }


    /*
    -----------------------------------------------------
    Loop back to first image
    -----------------------------------------------------
    */

    if (
        index >= productGalleryImages.length
    ) {

        index = 0;

    }


    /*
    -----------------------------------------------------
    Save current index
    -----------------------------------------------------
    */

    currentGalleryIndex =
        index;


    /*
    -----------------------------------------------------
    Change Main Image
    -----------------------------------------------------
    */

    if (
        mainGalleryImage
    ) {

        mainGalleryImage.src =
            productGalleryImages[index];

    }


    /*
    -----------------------------------------------------
    Update Active Thumbnail
    -----------------------------------------------------
    */

    galleryThumbnails.forEach(
        function(
            thumbnail,
            thumbnailIndex
        ) {


            if (
                thumbnailIndex === index
            ) {

                thumbnail.classList.add(
                    'active'
                );

            }

            else {

                thumbnail.classList.remove(
                    'active'
                );

            }

        }
    );



    /*
    -----------------------------------------------------
    Make Active Thumbnail Visible

    Useful when there are many images and the
    thumbnail row becomes horizontally scrollable.
    -----------------------------------------------------
    */

    if (
        galleryThumbnails[index]
    ) {

        galleryThumbnails[index]
            .scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });

    }

}



/*
=========================================================
PREVIOUS IMAGE
=========================================================
*/

function showPreviousGalleryImage() {

    showGalleryImage(
        currentGalleryIndex - 1
    );

}



/*
=========================================================
NEXT IMAGE
=========================================================
*/

function showNextGalleryImage() {

    showGalleryImage(
        currentGalleryIndex + 1
    );

}



/*
=========================================================
PREVIOUS BUTTON
=========================================================
*/

if (
    galleryPreviousButton
) {

    galleryPreviousButton.addEventListener(
        'click',
        function() {

            showPreviousGalleryImage();

        }
    );

}



/*
=========================================================
NEXT BUTTON
=========================================================
*/

if (
    galleryNextButton
) {

    galleryNextButton.addEventListener(
        'click',
        function() {

            showNextGalleryImage();

        }
    );

}



/*
=========================================================
THUMBNAIL CLICK
=========================================================

Clicking a thumbnail changes the main image.
=========================================================
*/

galleryThumbnails.forEach(
    function(
        thumbnail,
        index
    ) {


        thumbnail.addEventListener(
            'click',
            function() {

                showGalleryImage(
                    index
                );

            }
        );

    }
);



/*
=========================================================
AUTOMATIC SLIDING
=========================================================

Changes image every 4 seconds.
=========================================================
*/

let galleryAutoSlide = null;


function startGalleryAutoSlide() {


    /*
    -----------------------------------------------------
    Do nothing if there is only one image
    -----------------------------------------------------
    */

    if (
        productGalleryImages.length <= 1
    ) {

        return;

    }


    /*
    -----------------------------------------------------
    Clear any existing timer first
    -----------------------------------------------------
    */

    clearInterval(
        galleryAutoSlide
    );


    /*
    -----------------------------------------------------
    Start new timer
    -----------------------------------------------------
    */

    galleryAutoSlide =
        setInterval(
            function() {

                showNextGalleryImage();

            },
            4000
        );

}



function stopGalleryAutoSlide() {

    clearInterval(
        galleryAutoSlide
    );

}



/*
=========================================================
START AUTOMATIC SLIDE
=========================================================
*/

startGalleryAutoSlide();



/*
=========================================================
PAUSE WHILE HOVERING
=========================================================
*/

const productGallery =
    document.querySelector(
        '.product-gallery'
    );


if (
    productGallery
) {


    /*
    -----------------------------------------------
    Mouse enters gallery
    -----------------------------------------------
    */

    productGallery.addEventListener(
        'mouseenter',
        function() {

            stopGalleryAutoSlide();

        }
    );


    /*
    -----------------------------------------------
    Mouse leaves gallery
    -----------------------------------------------
    */

    productGallery.addEventListener(
        'mouseleave',
        function() {

            startGalleryAutoSlide();

        }
    );

}



/*
=========================================================
TOUCH / SWIPE SUPPORT
=========================================================

This allows mobile users to swipe:

    Swipe left  → Next image
    Swipe right → Previous image
=========================================================
*/

let galleryTouchStartX = 0;

let galleryTouchEndX = 0;


if (
    productGallery
) {


    productGallery.addEventListener(
        'touchstart',
        function(event) {

            galleryTouchStartX =
                event.changedTouches[0].screenX;

        }
    );


    productGallery.addEventListener(
        'touchend',
        function(event) {

            galleryTouchEndX =
                event.changedTouches[0].screenX;


            handleGallerySwipe();

        }
    );

}



/*
=========================================================
HANDLE SWIPE
=========================================================
*/

function handleGallerySwipe() {


    const swipeDistance =
        galleryTouchEndX -
        galleryTouchStartX;


    /*
    -----------------------------------------------------
    Ignore very small movements
    -----------------------------------------------------
    */

    if (
        Math.abs(swipeDistance) < 50
    ) {

        return;

    }


    /*
    -----------------------------------------------------
    Swipe right
    -----------------------------------------------------
    */

    if (
        swipeDistance > 0
    ) {

        showPreviousGalleryImage();

    }


    /*
    -----------------------------------------------------
    Swipe left
    -----------------------------------------------------
    */

    else {

        showNextGalleryImage();

    }

}

