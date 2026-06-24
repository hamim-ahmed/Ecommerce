/*
==================================================
LOAD NOTIFICATIONS
==================================================
*/

function loadNotifications() {

    axios.get(
        '/api/admin/notifications/'
    )

    .then(response => {

        const notifications =
            response.data;

        let html = '';

        notifications.forEach(

            notification => {

                html += `

                    <a
                
                        href="/admin-panel/orders/${notification.order_id}/"
                
                        class="
                            notification-item
                        "
                
                        style="
                            display:block;
                            padding:10px;
                            color:inherit;
                            text-decoration:none;
                        "
                
                    >
                
                        <strong>
                
                            ${notification.title}
                
                        </strong>
                
                        <br>
                
                        ${notification.message}
                
                    </a>
                
                `;
                }

        );

        document.getElementById(
            'notification-dropdown'
        ).innerHTML = html;

    })

    .catch(error => {

        console.error(
            'Notification Load Error:',
            error
        );

    });

}


/*
==================================================
LOAD UNREAD COUNT
==================================================
*/

function loadNotificationCount() {

    axios.get(
        '/api/admin/notifications/count/'
    )

    .then(response => {

        const count =
            response.data.count;

        const badge =

            document.getElementById(
                'notification-count'
            );

        if (count > 0) {

            badge.innerText =
                count;

            badge.style.display =
                'block';

        }

        else {

            badge.style.display =
                'none';

        }

    })

    .catch(error => {

        console.error(
            'Notification Count Error:',
            error
        );

    });

}


/*
==================================================
TOGGLE NOTIFICATION DROPDOWN
==================================================
*/

function toggleNotifications() {

    const dropdown =

        document.getElementById(
            'notification-dropdown'
        );

    if (

        dropdown.style.display
        === 'block'

    ) {

        dropdown.style.display =
            'none';

        return;
    }

    dropdown.style.display =
        'block';

    /*
    Mark all notifications as read
    */

    axios.patch(
        '/api/admin/notifications/read-all/'
    )

    .then(() => {

        loadNotificationCount();

    })

    .catch(error => {

        console.error(
            'Mark Read Error:',
            error
        );

    });

}


/*
==================================================
PAGE INITIALIZATION
==================================================
*/

document.addEventListener(

    'DOMContentLoaded',

    function () {

        loadNotifications();

        loadNotificationCount();

        const notificationBtn =

            document.getElementById(
                'notification-btn'
            );

        if (notificationBtn) {

            notificationBtn.addEventListener(

                'click',

                toggleNotifications

            );

        }

    }

);

// auto refresh.

setInterval(

    function () {

        loadNotificationCount();

        loadNotifications();

    },

    30000

);