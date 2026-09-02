/*
====================================================
CART SERVICE
====================================================

Purpose:

Handle all shopping cart operations.

LocalStorage Key:

cart

Stored Data Example:

[
    {
        id: 1,
        name: "Helmet A",
        price: 500,
        quantity: 2
    }
]
*/

const CartService = {

    /*
    -----------------------------------------
    Get Cart
    -----------------------------------------

    Reads cart from LocalStorage.

    If cart doesn't exist:

    return empty array.
    */

    getCart() {

        const cart =
            localStorage.getItem('cart');

        if (!cart) {

            return [];
        }

        return JSON.parse(cart);
    },

    /*
    -----------------------------------------
    Save Cart
    -----------------------------------------

    Converts JavaScript object
    into JSON string.
    */

    saveCart(cart) {

        localStorage.setItem(
            'cart',
            JSON.stringify(cart)
        );
    },

    /*
    -----------------------------------------
    Add Product
    -----------------------------------------
    */

    /*
    -----------------------------------------
    Add Product
    -----------------------------------------

    Supports custom quantity.

    Homepage:
    quantity defaults to 1.

    Product Details:
    quantity comes from quantity input.
    */

    addProduct(
        product,
        quantity = 1
    ) {

        let cart =
            this.getCart();

        const existingItem =
            cart.find(item =>
                item.id === product.id
            );

        if (existingItem) {

            existingItem.quantity +=
                Number(quantity);

        }

        else {

            cart.push({

                id: product.id,

                name: product.name,

                slug: product.slug,

                price: Number(product.price),

                image: product.main_image,

                quantity: Number(quantity)

            });

        }

        this.saveCart(cart);

        return cart;

    },

    /*
    -----------------------------------------
    Remove Product
    -----------------------------------------
    */

    removeProduct(productId) {

        let cart =
            this.getCart();

        cart = cart.filter(
            item =>
            item.id !== productId
        );

        this.saveCart(cart);

        return cart;
    },

    /*
    -----------------------------------------
    Update Quantity
    -----------------------------------------
    */

   /*
-----------------------------------------
Update Quantity
-----------------------------------------

Changes the quantity of a product.

Minimum quantity is always 1.

So:

0  -> 1
-1 -> 1
5  -> 5
*/

updateQuantity(
    productId,
    quantity
) {

    let cart =
        this.getCart();

    /*
    Convert the received value
    into a number.
    */

    quantity =
        Number(quantity);

    /*
    Prevent invalid quantities.

    Minimum = 1
    */

    if (
        !Number.isFinite(quantity) ||
        quantity < 1
    ) {

        quantity = 1;

    }

    /*
    Make sure quantity is
    a whole number.
    */

    quantity =
        Math.floor(quantity);

    /*
    Update matching product.
    */

    cart.forEach(item => {

        if (
            item.id === productId
        ) {

            item.quantity =
                quantity;

        }

    });

    /*
    Save updated cart.
    */

    this.saveCart(cart);

    return cart;
},

    /*
    -----------------------------------------
    Clear Cart
    -----------------------------------------
    */

    clearCart() {

        localStorage.removeItem(
            'cart'
        );
    },

    /*
    -----------------------------------------
    Total Items
    -----------------------------------------
    */

    getTotalItems() {

        let total = 0;

        this.getCart()
            .forEach(item => {

                total +=
                    item.quantity;
            });

        return total;
    },

    /*
    -----------------------------------------
    Cart Total
    -----------------------------------------
    */

    getCartTotal() {

        let total = 0;

        this.getCart()
            .forEach(item => {

                total += (
                    item.price
                    *
                    item.quantity
                );
            });

        return total;
    }
};



/*
=================================================
LOAD CART PAGE
=================================================
*/

/*
=================================================
LOAD CART PAGE
=================================================

Displays all products currently
stored in LocalStorage.

Quantity controls:

[-] [2] [+]

The quantity can be:

1. Decreased
2. Increased
3. Typed manually

Minimum quantity = 1
=================================================
*/

function loadCartPage() {

    const tbody =
        document.getElementById(
            'cart-table-body'
        );

    /*
    If this is not the cart page,
    stop here.
    */

    if (!tbody) {

        return;

    }

    /*
    Get current cart.
    */

    const cart =
        CartService.getCart();

    /*
    Clear existing rows.
    */

    tbody.innerHTML = '';

    /*
    Display every cart item.
    */

    cart.forEach(item => {

        /*
        Calculate product subtotal.

        Example:

        price = 3500
        quantity = 2

        subtotal = 7000
        */

        const subtotal =
            item.price *
            item.quantity;

        tbody.innerHTML += `

            <tr>

                <!-- Product -->

                <td>

                    ${item.name}

                </td>


                <!-- Price -->

                <td>

                    ৳ ${item.price}

                </td>


                <!-- Quantity -->

                <td>

                    <div
                        class="cart-quantity-control"
                    >

                        <!-- Decrease -->

                        <button

                            type="button"

                            class="ui mini button"

                            onclick="
                                decreaseCartQuantity(
                                    ${item.id}
                                )
                            "

                        >

                            −

                        </button>


                        <!-- Editable Quantity -->

                        <input

                            type="number"

                            min="1"

                            value="${item.quantity}"

                            class="cart-quantity-input"

                            onchange="
                                changeCartQuantity(
                                    ${item.id},
                                    this.value
                                )
                            "

                        >


                        <!-- Increase -->

                        <button

                            type="button"

                            class="ui mini button"

                            onclick="
                                increaseCartQuantity(
                                    ${item.id}
                                )
                            "

                        >

                            +

                        </button>

                    </div>

                </td>


                <!-- Subtotal -->

                <td>

                    ৳ ${subtotal}

                </td>


                <!-- Action -->

                <td>

                    <button

                        type="button"

                        class="ui red button"

                        onclick="
                            removeCartItem(
                                ${item.id}
                            )
                        "

                    >

                        Remove

                    </button>

                </td>

            </tr>

        `;

    });

    /*
    Update grand total.
    */

    document.getElementById(
        'cart-total'
    ).innerText =
        CartService.getCartTotal();

}

/*
=================================================
INCREASE CART QUANTITY
=================================================

Increases product quantity by 1.
=================================================
*/

function increaseCartQuantity(
    productId
) {

    /*
    Get current cart.
    */

    const cart =
        CartService.getCart();

    /*
    Find product.
    */

    const item =
        cart.find(
            item =>
                item.id === productId
        );

    /*
    If product doesn't exist,
    do nothing.
    */

    if (!item) {

        return;

    }

    /*
    Increase quantity by 1.
    */

    const newQuantity =
        item.quantity + 1;

    /*
    Save new quantity.
    */

    CartService.updateQuantity(

        productId,

        newQuantity

    );

    /*
    Rebuild cart page.

    This automatically updates:

    - quantity
    - subtotal
    - grand total
    */

    loadCartPage();

}


/*
=================================================
DECREASE CART QUANTITY
=================================================

Decreases product quantity by 1.

Minimum quantity = 1.

If quantity is already 1,
nothing happens.
=================================================
*/

function decreaseCartQuantity(
    productId
) {

    /*
    Get current cart.
    */

    const cart =
        CartService.getCart();

    /*
    Find product.
    */

    const item =
        cart.find(
            item =>
                item.id === productId
        );

    /*
    If product doesn't exist,
    do nothing.
    */

    if (!item) {

        return;

    }

    /*
    Do not allow quantity
    to become less than 1.
    */

    if (
        item.quantity <= 1
    ) {

        return;

    }

    /*
    Decrease quantity by 1.
    */

    const newQuantity =
        item.quantity - 1;

    /*
    Save quantity.
    */

    CartService.updateQuantity(

        productId,

        newQuantity

    );

    /*
    Refresh cart page.
    */

    loadCartPage();

}


/*
=================================================
CHANGE CART QUANTITY
=================================================

Used when the user manually
types a quantity.

Examples:

2 -> 5
5 -> 10
3 -> 1

Invalid values are converted
to the minimum quantity: 1.
=================================================
*/

function changeCartQuantity(

    productId,

    quantity

) {

    /*
    Convert input into number.
    */

    quantity =
        Number(quantity);

    /*
    Minimum quantity = 1.
    */

    if (
        !Number.isFinite(quantity) ||
        quantity < 1
    ) {

        quantity = 1;

    }

    /*
    Only allow whole numbers.
    */

    quantity =
        Math.floor(quantity);

    /*
    Update LocalStorage.
    */

    CartService.updateQuantity(

        productId,

        quantity

    );

    /*
    Refresh cart page.

    This updates:

    quantity
    subtotal
    total
    */

    loadCartPage();

}


/*
=================================================
REMOVE ITEM
=================================================
*/

function removeCartItem(
    productId
) {

    CartService.removeProduct(
        productId
    );

    loadCartPage();

    const badge =
        document.getElementById(
            'cart-count'
        );

    if (badge) {

        badge.innerText =
            CartService.getTotalItems();
    }
}


/*
=================================================
PROCEED TO CHECKOUT
=================================================

Don't allow checkout
if the cart is empty.
*/

function proceedToCheckout() {

    const cart =

        CartService.getCart();

    if (

        cart.length === 0

    ) {

        alert(

            'Your cart is empty.\n\nPlease add at least one product before checkout.'

        );

        return;
    }

    window.location.href =

        '/checkout/';

}