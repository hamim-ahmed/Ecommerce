/*
==================================================
ADMIN ORDERS PAGE
==================================================
*/

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

                    ${order.status}

                </td>

                <td>

                    ${formatDate(
                        order.created_at
                    )}

                </td>

                <td>

                    <a
                        href="
                        /admin-panel/orders/
                        ${order.id}/
                        "
                        class="
                            ui
                            small
                            primary
                            button
                        "
                    >

                        View

                    </a>

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