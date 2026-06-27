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

    addProduct(product) {

        let cart =
            this.getCart();

        const existingItem =
            cart.find(item =>
                item.id === product.id
            );

        /*
        Product already exists
        in cart.

        Increase quantity.
        */

        if (existingItem) {

            existingItem.quantity += 1;
        }

        /*
        New product.
        */

        else {

            cart.push({

                id: product.id,

                name: product.name,

                slug: product.slug,

                price: Number(product.price),

                image: product.main_image,

                quantity: 1
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

    updateQuantity(
        productId,
        quantity
    ) {

        let cart =
            this.getCart();

        cart.forEach(item => {

            if (
                item.id === productId
            ) {

                item.quantity =
                    quantity;
            }
        });

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

function loadCartPage() {

    const tbody =
        document.getElementById(
            'cart-table-body'
        );

    if (!tbody) {

        return;
    }

    const cart =
        CartService.getCart();

    tbody.innerHTML = '';

    cart.forEach(item => {

        const subtotal =
            item.price *
            item.quantity;

        tbody.innerHTML += `

            <tr>

                <td>

                    ${item.name}

                </td>

                <td>

                    ৳ ${item.price}

                </td>

                <td>

                    ${item.quantity}

                </td>

                <td>

                    ৳ ${subtotal}

                </td>

                <td>

                    <button
                        class="ui red button"

                        onclick="removeCartItem(
                            ${item.id}
                        )">

                        Remove

                    </button>

                </td>

            </tr>

        `;
    });

    document.getElementById(
        'cart-total'
    ).innerText =
        CartService.getCartTotal();
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