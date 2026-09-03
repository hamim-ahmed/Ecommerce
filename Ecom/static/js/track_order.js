/*
==================================================
TRACK ORDER PAGE
==================================================

Purpose:

Handles the public guest order tracking page.

Flow:

Customer enters tracking number
        ↓
Click Track Order
        ↓
API.trackOrder()
        ↓
Public Tracking API
        ↓
Display order status
*/


/*
==================================================
PAGE ELEMENTS
==================================================
*/


const trackingInput =
    document.getElementById(
        'tracking-number'
    );


const trackButton =
    document.getElementById(
        'track-order-btn'
    );


const trackAnotherButton =
    document.getElementById(
        'track-another-btn'
    );


const trackingError =
    document.getElementById(
        'tracking-error'
    );


const trackingErrorText =
    document.getElementById(
        'tracking-error-text'
    );


const trackingResult =
    document.getElementById(
        'tracking-result'
    );



/*
==================================================
TRACK ORDER
==================================================
*/


function trackOrder() {

    /*
    ----------------------------------------------
    Get tracking number
    ----------------------------------------------
    */

    const trackingNumber =
        trackingInput.value
            .trim()
            .toUpperCase();


    /*
    ----------------------------------------------
    Basic validation
    ----------------------------------------------
    */

    if (!trackingNumber) {

        showTrackingError(
            'Please enter your tracking number.'
        );

        return;
    }


    /*
    ----------------------------------------------
    Hide previous messages
    ----------------------------------------------
    */

    hideTrackingError();

    trackingResult.style.display =
        'none';


    /*
    ----------------------------------------------
    Disable button
    ----------------------------------------------

    This prevents the customer from
    accidentally sending multiple requests.
    */

    trackButton.disabled = true;

    trackButton.innerHTML =

        '<i class="spinner loading icon"></i>' +
        ' Checking...';


    /*
    ----------------------------------------------
    Send request to API
    ----------------------------------------------
    */

    API.trackOrder(
        trackingNumber
    )

    .then(response => {

        /*
        ------------------------------------------
        Get order data
        ------------------------------------------
        */

        const order =
            response.data.order;


        /*
        ------------------------------------------
        Display order information
        ------------------------------------------
        */

        displayOrder(
            order
        );


        /*
        ------------------------------------------
        Restore button
        ------------------------------------------
        */

        resetTrackButton();

    })


    .catch(error => {

        console.error(
            'Tracking Error:',
            error
        );


        /*
        ------------------------------------------
        API returned "not found"
        ------------------------------------------
        */

        if (
            error.response &&
            error.response.status === 404
        ) {

            showTrackingError(
                'No order was found with this tracking number.'
            );

        }

        /*
        ------------------------------------------
        Other API error
        ------------------------------------------
        */

        else {

            showTrackingError(
                'Unable to track the order right now. Please try again.'
            );

        }


        /*
        ------------------------------------------
        Restore button
        ------------------------------------------
        */

        resetTrackButton();

    });

}



/*
==================================================
DISPLAY ORDER
==================================================
*/


function displayOrder(
    order
) {

    /*
    ----------------------------------------------
    Tracking number
    ----------------------------------------------
    */

    document.getElementById(
        'result-tracking-number'
    ).innerText =
        order.tracking_number;


    /*
    ----------------------------------------------
    Order creation date
    ----------------------------------------------
    */

    document.getElementById(
        'result-created-at'
    ).innerText =
        formatDate(
            order.created_at
        );


    /*
    ----------------------------------------------
    Current status
    ----------------------------------------------
    */

    displayCurrentStatus(
        order.status
    );


    /*
    ----------------------------------------------
    Status timeline
    ----------------------------------------------
    */

    displayStatusTimeline(
        order
    );


    /*
    ----------------------------------------------
    Show result section
    ----------------------------------------------
    */

    trackingResult.style.display =
        'block';


    /*
    ----------------------------------------------
    Scroll to result
    ----------------------------------------------
    */

    trackingResult.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });

}



/*
==================================================
CURRENT STATUS
==================================================
*/


function displayCurrentStatus(
    status
) {

    const statusElement =
        document.getElementById(
            'current-status'
        );


    /*
    ----------------------------------------------
    Convert status into readable text
    ----------------------------------------------
    */

    const statusText =
        getStatusText(
            status
        );


    statusElement.innerText =
        statusText;


    /*
    ----------------------------------------------
    Remove previous Semantic UI colors
    ----------------------------------------------
    */

    statusElement.classList.remove(
        'yellow',
        'blue',
        'green',
        'red',
        'grey'
    );


    /*
    ----------------------------------------------
    Apply status color
    ----------------------------------------------
    */

    switch (status) {

        case 'pending':

            statusElement.classList.add(
                'yellow'
            );

            break;


        case 'confirmed':

            statusElement.classList.add(
                'blue'
            );

            break;


        case 'processing':

            statusElement.classList.add(
                'blue'
            );

            break;


        case 'delivered':

            statusElement.classList.add(
                'green'
            );

            break;


        case 'cancelled':

            statusElement.classList.add(
                'red'
            );

            break;


        default:

            statusElement.classList.add(
                'grey'
            );

    }

}



/*
==================================================
STATUS TIMELINE
==================================================
*/


function displayStatusTimeline(
    order
) {

    /*
    ----------------------------------------------
    Order Placed
    ----------------------------------------------
    */

    setStatusStep(
        'status-placed',
        'status-placed-icon',
        'status-placed-date',
        true,
        order.created_at,
        'Order placed successfully'
    );


    /*
    ----------------------------------------------
    Confirmed
    ----------------------------------------------
    */

    setStatusStep(
        'status-confirmed',
        'status-confirmed-icon',
        'status-confirmed-date',
        Boolean(
            order.confirmed_at
        ),
        order.confirmed_at,
        'Waiting for confirmation'
    );


    /*
    ----------------------------------------------
    Processing
    ----------------------------------------------
    */

    setStatusStep(
        'status-processing',
        'status-processing-icon',
        'status-processing-date',
        Boolean(
            order.processing_at
        ),
        order.processing_at,
        'Waiting for processing'
    );


    /*
    ----------------------------------------------
    Delivered
    ----------------------------------------------
    */

    setStatusStep(
        'status-delivered',
        'status-delivered-icon',
        'status-delivered-date',
        Boolean(
            order.delivered_at
        ),
        order.delivered_at,
        'Waiting for delivery'
    );


    /*
    ----------------------------------------------
    Cancelled
    ----------------------------------------------
    */

    const cancelledSection =
        document.getElementById(
            'status-cancelled'
        );


    if (
        order.cancelled_at
    ) {

        cancelledSection.style.display =
            'block';


        setStatusStep(
            'status-cancelled',
            'status-cancelled-icon',
            'status-cancelled-date',
            true,
            order.cancelled_at,
            'Order cancelled'
        );

    }

    else {

        cancelledSection.style.display =
            'none';

    }

}



/*
==================================================
SET STATUS STEP
==================================================
*/


function setStatusStep(
    sectionId,
    iconId,
    dateId,
    completed,
    dateValue,
    waitingText
) {

    const section =
        document.getElementById(
            sectionId
        );


    const icon =
        document.getElementById(
            iconId
        );


    const dateElement =
        document.getElementById(
            dateId
        );


    /*
    ----------------------------------------------
    Completed
    ----------------------------------------------
    */

    if (completed) {

        section.classList.add(
            'positive'
        );


        icon.className =
            'large check circle icon';


        dateElement.innerText =
            formatDate(
                dateValue
            );

    }


    /*
    ----------------------------------------------
    Not completed
    ----------------------------------------------
    */

    else {

        section.classList.remove(
            'positive'
        );


        icon.className =
            'large circle outline icon';


        dateElement.innerText =
            waitingText;

    }

}



/*
==================================================
STATUS TEXT
==================================================
*/


function getStatusText(
    status
) {

    switch (status) {

        case 'pending':

            return 'Pending';


        case 'confirmed':

            return 'Confirmed';


        case 'processing':

            return 'Processing';


        case 'delivered':

            return 'Delivered';


        case 'cancelled':

            return 'Cancelled';


        default:

            return 'Unknown';

    }

}



/*
==================================================
FORMAT DATE
==================================================
*/


function formatDate(
    dateValue
) {

    if (!dateValue) {

        return '-';

    }


    const date =
        new Date(
            dateValue
        );


    return date.toLocaleString(
        'en-BD',
        {
            day: '2-digit',
            month: 'short',
            year: 'numeric',

            hour: '2-digit',
            minute: '2-digit'
        }
    );

}



/*
==================================================
SHOW ERROR
==================================================
*/


function showTrackingError(
    message
) {

    trackingErrorText.innerText =
        message;


    trackingError.style.display =
        'block';

}



/*
==================================================
HIDE ERROR
==================================================
*/


function hideTrackingError() {

    trackingError.style.display =
        'none';

}



/*
==================================================
RESET TRACK BUTTON
==================================================
*/


function resetTrackButton() {

    trackButton.disabled =
        false;


    trackButton.innerHTML =

        '<i class="search icon"></i>' +
        ' Track Order';

}



/*
==================================================
TRACK ANOTHER ORDER
==================================================
*/


function trackAnotherOrder() {

    /*
    ----------------------------------------------
    Clear previous result
    ----------------------------------------------
    */

    trackingResult.style.display =
        'none';


    hideTrackingError();


    /*
    ----------------------------------------------
    Clear input
    ----------------------------------------------
    */

    trackingInput.value =
        '';


    /*
    ----------------------------------------------
    Focus input
    ----------------------------------------------
    */

    trackingInput.focus();


    /*
    ----------------------------------------------
    Scroll back to search
    ----------------------------------------------
    */

    trackingInput.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });

}



/*
==================================================
BUTTON EVENTS
==================================================
*/


trackButton.addEventListener(
    'click',
    trackOrder
);


trackAnotherButton.addEventListener(
    'click',
    trackAnotherOrder
);



/*
==================================================
ENTER KEY SUPPORT
==================================================

The customer can press Enter instead
of clicking Track Order.
*/


trackingInput.addEventListener(
    'keydown',
    function(event) {

        if (
            event.key === 'Enter'
        ) {

            event.preventDefault();

            trackOrder();

        }

    }
);



/*
==================================================
AUTO-FILL LAST ORDER
==================================================

If the customer came from the Order Success
page, checkout.js saved the tracking number
in LocalStorage.

We automatically place that number
inside the input field.

The customer can then simply click
Track Order.
*/


const lastTrackingNumber =
    localStorage.getItem(
        'last_order_tracking_number'
    );


if (
    lastTrackingNumber
) {

    trackingInput.value =
        lastTrackingNumber;

}