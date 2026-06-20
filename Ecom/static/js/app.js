/*
==================================================
MAIN VUE APPLICATION
==================================================
*/

const app = Vue.createApp({

    data() {

        return {

            categories: [],

            cartCount: 0,
        }
    },

    methods: {

        /*
        --------------------------------------
        Load Categories
        --------------------------------------
        */

        loadCategories() {

            API.getCategories()

                .then(response => {

                    console.log(
                        'Categories:',
                        response.data
                    );

                    this.categories =
                        response.data;
                })

                .catch(error => {

                    console.error(error);
                });
        },

        /*
        --------------------------------------
        Refresh Cart Count
        --------------------------------------
        */

        updateCartCount() {

            this.cartCount =
                CartService.getTotalItems();

            const badge =
                document.getElementById(
                    'cart-count'
                );

            if (badge) {

                badge.innerText =
                    this.cartCount;
            }
        }
    },

    mounted() {

        this.loadCategories();

        this.updateCartCount();
    }
});

app.mount('#app');



/*
=================================================
GLOBAL FUNCTION
=================================================

Allows HTML button
to call addToCart().
*/

function addToCart(
    id,
    name,
    slug,
    price,
    image
) {

    CartService.addProduct({

        id: id,

        name: name,

        slug: slug,

        price: price,

        main_image: image
    });

    /*
    Refresh badge
    */

    const badge =
        document.getElementById(
            'cart-count'
        );

    if (badge) {

        badge.innerText =
            CartService.getTotalItems();
    }

    alert(
        name +
        ' added to cart.'
    );
}