/*
==================================================
ADMIN DASHBOARD
==================================================
*/

function loadDashboard() {

    axios.get(
        '/api/admin/dashboard/'
    )

    .then(response => {

        const data =
            response.data;

        const container =
            document.getElementById(
                'dashboard-cards'
            );

        container.innerHTML = `

            <!-- Pending Orders -->

            <div
                class="ui blue card dashboard-card"
                onclick="
                    window.location.href=
                    '/admin-panel/orders/?status=pending'
                "
            >

                <div class="content">

                    <div class="header">

                        Pending Orders

                    </div>

                    <div class="description">

                        <h1>

                            ${data.pending_orders}

                        </h1>

                    </div>

                </div>

            </div>

            <!-- Confirmed Orders -->

            <div
                class="ui green card dashboard-card"
                onclick="
                    window.location.href=
                    '/admin-panel/orders/?status=confirmed'
                "
            >

                <div class="content">

                    <div class="header">

                        Confirmed Orders

                    </div>

                    <div class="description">

                        <h1>

                            ${data.confirmed_orders}

                        </h1>

                    </div>

                </div>

            </div>

            <!-- Processing Orders -->

            <div
                class="ui orange card dashboard-card"
                onclick="
                    window.location.href=
                    '/admin-panel/orders/?status=processing'
                "
            >

                <div class="content">

                    <div class="header">

                        Processing Orders

                    </div>

                    <div class="description">

                        <h1>

                            ${data.processing_orders}

                        </h1>

                    </div>

                </div>

            </div>

            <!-- Delivered Orders -->

            <div
                class="ui teal card dashboard-card"
                onclick="
                    window.location.href=
                    '/admin-panel/orders/?status=delivered'
                "
            >

                <div class="content">

                    <div class="header">

                        Delivered Orders

                    </div>

                    <div class="description">

                        <h1>

                            ${data.delivered_orders}

                        </h1>

                    </div>

                </div>

            </div>

            <!-- Cancelled Orders -->

            <div
                class="ui grey card dashboard-card"
                onclick="
                    window.location.href=
                    '/admin-panel/orders/?status=cancelled'
                "
            >

                <div class="content">

                    <div class="header">

                        Cancelled Orders

                    </div>

                    <div class="description">

                        <h1>

                            ${data.cancelled_orders}

                        </h1>

                    </div>

                </div>

            </div>

        `;
    })

    .catch(error => {

        console.error(
            'Dashboard Error:',
            error
        );

    });
}