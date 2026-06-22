/*
==================================================
ADMIN ORDER DETAIL
==================================================
*/

function loadOrderDetail() {

    axios.get(
        '/api/admin/orders/' +
        ORDER_ID +
        '/'
    )

    .then(response => {

        renderOrderDetail(
            response.data
        );
    })

    .catch(error => {

        console.error(
            error
        );

    });
}

function getStatusButton(
    currentStatus,
    buttonStatus,
    label,
    color
) {

    const disabled =
        currentStatus === buttonStatus;

    return `

        <button

            class="
                ui
                ${color}
                button
            "

            ${disabled ? 'disabled' : ''}

            onclick="
                updateOrderStatus(
                    '${buttonStatus}'
                )
            "

        >

            ${label}

        </button>

    `;
}



/*
==================================================
RENDER ORDER
==================================================
*/

function renderOrderDetail(
    order
) {

    const container =
        document.getElementById(
            'order-detail-container'
        );

    let itemsHtml = '';

    order.items.forEach(item => {

        itemsHtml += `

            <tr>

                <td>

                    ${item.product_name}

                </td>

                <td>

                    ${item.quantity}

                </td>

                <td>

                    ৳ ${item.unit_price}

                </td>

                <td>

                    ৳ ${item.subtotal}

                </td>

            </tr>

        `;
    });

    container.innerHTML = `

        <h1 class="ui header">

            Order #${order.id}

        </h1>

        <div class="ui stackable grid">

            <!-- CUSTOMER INFO -->

            <div class="eight wide column">

                <div class="ui segment">

                    <h3>

                        Customer Information

                    </h3>

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

                        <strong>Note:</strong>

                        ${order.note || '-'}

                    </p>

                </div>

            </div>

            <!-- ORDER SUMMARY -->

            <div class="eight wide column">

                <div class="ui segment">

                    <h3>

                        Order Summary

                    </h3>

                    <p>

                        <strong>Status:</strong>

                        ${order.status}

                    </p>

                    <p>

                        <strong>Subtotal:</strong>

                        ৳ ${order.subtotal}

                    </p>

                    <p>

                        <strong>Delivery:</strong>

                        ৳ ${order.delivery_charge}

                    </p>

                    <p>

                        <strong>Total:</strong>

                        ৳ ${order.total_amount}

                    </p>

                </div>

            </div>

        </div>

        <!-- ITEMS -->

        <div class="ui segment">

            <h3>

                Ordered Items

            </h3>

            <table
                class="
                    ui
                    celled
                    table
                "
            >

                <thead>

                    <tr>

                        <th>Product</th>

                        <th>Qty</th>

                        <th>Unit Price</th>

                        <th>Subtotal</th>

                    </tr>

                </thead>

                <tbody>

                    ${itemsHtml}

                </tbody>

            </table>

        </div>

        <!-- STATUS ACTIONS -->

        <div class="ui segment">

            <h3>

                Update Status

            </h3>

            <div class="ui buttons">

                ${getStatusButton(
                    order.status,
                    'confirmed',
                    'Confirm',
                    'blue'
                )}
            
                ${getStatusButton(
                    order.status,
                    'processing',
                    'Processing',
                    'orange'
                )}
            
                ${getStatusButton(
                    order.status,
                    'delivered',
                    'Delivered',
                    'green'
                )}
            
                ${getStatusButton(
                    order.status,
                    'cancelled',
                    'Cancel',
                    'red'
                )}
            
            </div>


        </div>

    `;
}

/*
==================================================
UPDATE ORDER STATUS
==================================================
*/

function updateOrderStatus(
    status
) {

    if (

        !confirm(
            `Change order status to "${status}" ?`
        )

    ) {

        return;
    }

    axios.patch(

        '/api/admin/orders/' +
        ORDER_ID +
        '/status/',

        {
            status: status
        }

    )

    .then(response => {

        alert(
            response.data.message
        );

        /*
        Reload page
        to refresh status
        */

        loadOrderDetail();

    })

    .catch(error => {

        console.error(
            'Status Update Error:',
            error
        );

        console.log(
            'Response:',
            error.response
        );

        console.log(
            'Data:',
            error.response?.data
        );

        alert(
            'Failed to update status.'
        );

    });
}
