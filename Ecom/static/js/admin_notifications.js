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

        document.getElementById(
            'notification-count'
        ).innerText =
            notifications.length;

        let html = '';

        notifications.forEach(

            notification => {

                html += `

                    <div

                        class="
                            notification-item
                        "

                    >

                        <strong>

                            ${notification.title}

                        </strong>

                        <br>

                        ${notification.message}

                    </div>

                `;
            }
        );

        document.getElementById(

            'notification-dropdown'

        ).innerHTML = html;

    });
}

document.addEventListener(

    'DOMContentLoaded',

    function () {

        loadNotifications();

        document

        .getElementById(
            'notification-btn'
        )

        .addEventListener(

            'click',

            function () {

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

                }

                else {

                    dropdown.style.display =
                        'block';
                }
            }
        );
    }
);