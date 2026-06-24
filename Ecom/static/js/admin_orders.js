/*
==================================================
ADMIN ORDERS PAGE
==================================================
*/

/*
==================================================
ORDER STATUS BADGES
==================================================

Converts order status text into
colored Semantic UI labels.

Example:

pending   -> yellow
confirmed -> blue
delivered -> green
*/

function getStatusBadge(status) {

    const statusColors = {

        pending: 'yellow',

        confirmed: 'blue',

        processing: 'orange',

        delivered: 'green',

        cancelled: 'red'
    };

    return `

        <div
            class="
                ui
                ${statusColors[status]}
                label
            "
        >

            ${status}

        </div>

    `;
}


/*
==================================================
ORDER QUICK PREVIEW
==================================================

Loads a single order and displays
basic information inside a modal.

This is only for quick viewing.

Full editing still happens from
the Order Details page.
*/

function previewOrder(
    orderId
) {

    axios.get(

        `/api/admin/orders/${orderId}/`

    )

    .then(response => {

        const order =
            response.data;

        document.getElementById(

            'order-preview-content'

        ).innerHTML = `

            <p>

                <strong>Name:</strong>

                ${order.customer_name}

            </p>

            <p>

                <strong>Phone:</strong>

                ${order.phone}

            </p>

            <p>

                <strong>Address:</strong>

                ${order.address}

            </p>

            <p>

                <strong>Status:</strong>

                ${order.status}

            </p>

            <p>

                <strong>Total:</strong>

                ৳${order.total_amount}

            </p>

        `;

        document.getElementById(
        'order-preview-modal'
            ).style.display = 'block';

                })

    .catch(error => {

        console.error(error);

        alert(
            'Failed to load order.'
        );

    });

}


function loadOrders() {

    /*
    ---------------------------------------
    Get URL Status Filter

    Example:

    ?status=pending
    ---------------------------------------
    */

    const params =
        new URLSearchParams(
            window.location.search
        );

    const status =
        params.get('status');

    let apiUrl =
        '/api/admin/orders/';

    if (status) {

        apiUrl +=
            '?status=' + status;
    }

    axios.get(apiUrl)

    .then(response => {

        renderOrders(
            response.data
        );
    })

    .catch(error => {

        console.error(
            error
        );
    });
}


/*
==================================================
RENDER ORDERS
==================================================
*/

function renderOrders(
    orders
) {

    const tbody =
        document.getElementById(
            'orders-table-body'
        );

    tbody.innerHTML = '';

    orders.forEach(order => {

        tbody.innerHTML += `

            <tr>

                <td>

                    ${order.id}

                </td>

                <td>

                    ${order.customer_name}

                </td>

                <td>

                    ${order.phone}

                </td>

                <td>

                    ৳ ${order.total_amount}

                </td>

                <td>
                    ${getStatusBadge(
                        order.status
                    )}
                </td>

                <td>

                    ${formatDate(
                        order.created_at
                    )}

                </td>

                <td>

                    <!--
                    Full Order Details Page
                    -->
                
                    <a
                        href="/admin-panel/orders/${order.id}/"
                        class="ui primary button"
                    >
                
                        View
                
                    </a>
                
                    <!--
                    Quick Preview Popup
                    -->
                
                    <button
                
                        class="
                            ui
                            grey
                            button
                        "
                
                        onclick="
                            previewOrder(
                                ${order.id}
                            )
                        "
                
                    >
                
                        Quick View
                
                    </button>
                
                </td>

            </tr>

        `;
    });
}


/*
==================================================
FORMAT DATE
==================================================
*/

function formatDate(
    dateString
) {

    return new Date(
        dateString
    ).toLocaleDateString();
}



/*
==================================================
SEARCH ORDERS
==================================================
*/

function filterOrders() {

    const searchValue =

        document
            .getElementById(
                'order-search'
            )
            .value
            .toLowerCase();

    const rows =

        document.querySelectorAll(

            '#orders-table-body tr'

        );

    rows.forEach(row => {

        const text =

            row.innerText
                .toLowerCase();

        if (

            text.includes(
                searchValue
            )

        ) {

            row.style.display = '';

        }

        else {

            row.style.display =
                'none';
        }
    });
}


/*
==================================================
PAGE LOAD
==================================================
*/

document.addEventListener(

    'DOMContentLoaded',

    function () {

        loadOrders();

        const searchInput =

            document.getElementById(
                'order-search'
            );

        if (searchInput) {

            searchInput.addEventListener(

                'keyup',

                filterOrders

            );
        }

        const statusFilter =

            document.getElementById(
                'status-filter'
            );

        if (statusFilter) {

            statusFilter.addEventListener(

                'change',

                applyStatusFilter

            );
        }
    }
);



/*
==================================================
STATUS FILTER
==================================================
*/

function applyStatusFilter() {

    const selectedStatus =

        document
            .getElementById(
                'status-filter'
            )
            .value
            .toLowerCase();

    const rows =

        document.querySelectorAll(

            '#orders-table-body tr'

        );

    rows.forEach(row => {

        const statusCell =

            row.children[4];

        const statusText =

            statusCell.innerText
                .toLowerCase();

        if (

            selectedStatus === ''

        ) {

            row.style.display = '';

        }

        else if (

            statusText.includes(
                selectedStatus
            )

        ) {

            row.style.display = '';

        }

        else {

            row.style.display =
                'none';
        }
    });
}