

    /*
    ======================================================
    LOAD TRACKING NUMBER
    ======================================================

    checkout.js saves the tracking number in LocalStorage
    before redirecting to this page.

    Key:

        last_order_tracking_number
    ======================================================
    */

    const trackingNumber =
        localStorage.getItem(
            'last_order_tracking_number'
        );


    /*
    ------------------------------------------------------
    Display Tracking Number
    ------------------------------------------------------
    */

    const trackingElement =
        document.getElementById(
            'tracking-number'
        );


    if (trackingNumber) {

        trackingElement.innerText =
            trackingNumber;

    } else {

        /*
        If someone directly opens the success page
        without placing an order first.
        */

        trackingElement.innerText =
            'Tracking number unavailable';

    }


    /*
    ======================================================
    COPY TRACKING NUMBER
    ======================================================
    */

    function copyTrackingNumber() {

        /*
        Make sure a tracking number actually exists.
        */

        if (!trackingNumber) {

            alert(
                'Tracking number is unavailable.'
            );

            return;
        }


        /*
        Copy tracking number to clipboard.
        */

        navigator.clipboard.writeText(
            trackingNumber
        )
        .then(() => {

            alert(
                'Tracking number copied!'
            );

        })
        .catch(error => {

            console.error(
                'Copy failed:',
                error
            );

            alert(
                'Unable to copy tracking number.'
            );

        });

    }

