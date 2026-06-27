/*
==================================================
CHECKOUT PAGE
==================================================
*/

let deliveryOptions = [];

function loadCheckoutPage() {


    /*
    Prevent Empty Checkout
    */

    const cart =

        CartService.getCart();

    if (

        cart.length === 0

    ) {

        alert(

            'Your cart is empty.'

        );

        window.location.href =

            '/cart/';

        return;

    }

    const subtotal =
        CartService.getCartTotal();

    ...


    const subtotal =
        CartService.getCartTotal();

    document.getElementById(
        'subtotal'
    ).innerText = subtotal;

    API.getDeliveryCharges()

        .then(response => {

            deliveryOptions =
                response.data;

            const select =
                document.getElementById(
                    'delivery-area'
                );

            response.data.forEach(
                item => {

                select.innerHTML += `
                    <option
                        value="${item.id}">

                        ${item.area_name}
                    </option>
                `;
            });

            setTimeout(() => {

                updateDelivery();

            }, 100);
        });
}


/*
==================================================
UPDATE DELIVERY CHARGE
==================================================
*/

function updateDelivery() {

    const select =
        document.getElementById(
            'delivery-area'
        );

    const selectedId =
        parseInt(select.value);

    const option =
        deliveryOptions.find(
            item =>
            item.id === selectedId
        );

    if (!option) {

        return;
    }

    const deliveryCharge =
        Number(option.charge);

    const subtotal =
        CartService.getCartTotal();

    const grandTotal =
        subtotal + deliveryCharge;

    document.getElementById(
        'delivery-charge'
    ).innerText =
        deliveryCharge;

    document.getElementById(
        'grand-total'
    ).innerText =
        grandTotal;
}


/*
==================================================
BUILD ORDER ITEMS
==================================================
*/

function buildOrderItems() {

    const cart =
        CartService.getCart();

    return cart.map(item => {

        return {

            product_id:
                item.id,

            product_name:
                item.name,

            quantity:
                item.quantity,

            unit_price:
                item.price
        };
    });
}

/*
==================================================
PLACE ORDER
==================================================
*/

/*
==================================================
PLACE ORDER
==================================================
*/

function placeOrder() {

    const customerName =
        document.getElementById(
            'customer-name'
        ).value;

    const phone =
        document.getElementById(
            'customer-phone'
        ).value;

    const address =
        document.getElementById(
            'customer-address'
        ).value;

    const deliverySelect =
        document.getElementById(
            'delivery-area'
        );

    const selectedOption =
        deliveryOptions.find(
            item =>
            item.id ===
            parseInt(
                deliverySelect.value
            )
        );

    /*
    -----------------------------------------
    Basic Validation
    -----------------------------------------
    */

    if (
        !customerName ||
        !phone ||
        !address
    ) {

        alert(
            'Please fill all required fields.'
        );

        return;
    }

    /*
    -----------------------------------------
    Build Request Payload
    -----------------------------------------
    */

    const orderData = {

        customer_name:
            customerName,

        phone:
            phone,

        address:
            address,

        delivery_area:
            selectedOption.area_name,

        delivery_charge:
            selectedOption.charge,

        items:
            buildOrderItems()
    };

    console.log(
        'Order Data:',
        orderData
    );

    /*
    -----------------------------------------
    Send To API
    -----------------------------------------
    */

    API.createOrder(orderData)

        .then(response => {

            /*
            Clear Cart
            */

            CartService.clearCart();

            /*
            Redirect
            */

            window.location.href =
                '/order-success/';
        })

        .catch(error => {

            console.error(error);

            alert(
                'Failed to place order.'
            );
        });
}