/*
==================================================
MAIN VUE APPLICATION
==================================================
*/

const app = Vue.createApp({

    delimiters: [

        '[[',

        ']]'

    ],

    data() {

        return {

            categories: [],

            products: [],

            banners: [],

            currentBanner: 0,

            bannerInterval: null,

            selectedCategory: null,

            selectedSubCategory: null,

            expandedCategory: null,

            cartCount: 0,

            searchKeyword: '',
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

        toggleCategory(categoryId){

            if(this.expandedCategory === categoryId){

                this.expandedCategory = null;

            }else{

                this.expandedCategory = categoryId;

            }

        },

        /*
        --------------------------------------
        Load Homepage Banners
        --------------------------------------
        */

        loadBanners() {

            API.getBanners()

            .then(response => {

                this.banners =

                    response.data;

                /*
                Start slider
                only if banners exist.
                */

                if (

                    this.banners.length > 1

                ) {

                    this.startBannerSlider();

                }

            })

            .catch(error => {

                console.error(error);

            });

        },

        /*
        --------------------------------------
        Auto Slider
        --------------------------------------
        */

        startBannerSlider() {

            this.bannerInterval =

                setInterval(() => {

                    this.nextBanner();

                }, 5000);

        },

        /*
        --------------------------------------
        Next Banner
        --------------------------------------
        */

        nextBanner() {

            this.currentBanner =

                (

                    this.currentBanner + 1

                )

                %

                this.banners.length;

        },

        /*
        --------------------------------------
        Previous Banner
        --------------------------------------
        */

        previousBanner() {

            this.currentBanner--;

            if (

                this.currentBanner < 0

            ) {

                this.currentBanner =

                    this.banners.length - 1;

            }

        },

        /*
        --------------------------------------
        Go To Banner
        --------------------------------------
        */

        goToBanner(

            index

        ) {

            this.currentBanner =

                index;

        },

        /*
        --------------------------------------
        Load Products
        --------------------------------------
        */

        loadProducts(

            category = null,

            search = null

        ){

            API.getProducts(

                category,

                search

            )

            .then(response=>{

                this.products =

                    response.data;

            })

            .catch(error=>{

                console.error(error);

            });

        },


        searchProducts() {

            const keyword =

                this.searchKeyword.trim();

            /*
            If user searches from
            another page, go to homepage
            with search parameter.
            */

            if (

                !window.location.pathname.startsWith('/')

                ||

                window.location.pathname !== '/'

            ) {

                window.location.href =

                    '/?search=' +

                    encodeURIComponent(

                        keyword

                    );

                return;

            }

            this.loadProducts(

                this.selectedCategory,

                this.selectedSubCategory,

                keyword

            );

        },


        clearSearch(){

            if(

                this.searchKeyword.trim()===''

            ){

                this.loadProducts(

                    this.selectedCategory,

                    this.selectedSubCategory

                );

            }

        },



        /*
        --------------------------------------
        Refresh Cart Count
        --------------------------------------
        */

        /*
        --------------------------------------
        Refresh Cart Count
        --------------------------------------

        Updates both:

        1. Desktop cart badge
        2. Mobile cart badge
        */

        updateCartCount() {

            // Total number of products
            // currently inside cart.

            this.cartCount =

                CartService.getTotalItems();

            /*
            --------------------------------------
            Desktop Badge
            --------------------------------------
            */

            const desktopBadge =

                document.getElementById(

                    'cart-count'

                );

            if (

                desktopBadge

            ) {

                desktopBadge.innerText =

                    this.cartCount;

            }

            /*
            --------------------------------------
            Mobile Badge
            --------------------------------------
            */

            const mobileBadge =

                document.getElementById(

                    'cart-count-mobile'

                );

            if (

                mobileBadge

            ) {

                mobileBadge.innerText =

                    this.cartCount;

            }

        },

                /*
        --------------------------------------
        Add Product To Cart
        --------------------------------------
        */

        addProductToCart(
            product
            ) {

                addToCart(

                    product.id,

                    product.name,

                    product.slug,

                    product.price,

                    product.main_image

                );

            }
        },

       /*
    --------------------------------------
    Application Startup
    --------------------------------------

    When the application starts,
    check whether the URL contains

    /?category=id

    If yes,

    load only that category.

    Otherwise,

    load every product.
    */

    mounted() {

        this.loadCategories();

        this.loadBanners();

        /*
        --------------------------------------
        Read URL Parameters

        Examples:

        /

        /?category=2

        /?search=helmet

        /?category=2&search=helmet
        --------------------------------------
        */

        const params =

            new URLSearchParams(

                window.location.search

            );

        // Category parameter

        const category =

            params.get(

                'category'

            );


         // SunCategory parameter
        const subcategory =

            params.get(

                'subcategory'

            );

        // Search parameter

        const search =

            params.get(

                'search'

            );

        /*
        Save values
        */

        this.selectedCategory =

            category
                ? Number(category)
                : null;

        this.selectedSubCategory =

            subcategory

                ? Number(subcategory)

                : null;

        this.searchKeyword =

            search || '';

        /*
        Load products using both filters.
        */

        this.loadProducts(

            this.selectedCategory,

            this.selectedSubCategory,

            this.searchKeyword

        );

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
    image,
    quantity = 1
) {

    CartService.addProduct(

        {

            id:id,

            name:name,

            slug:slug,

            price:price,

            main_image:image

        },

        quantity

    );

    /*
    Refresh badge
    */

    const desktopBadge =

        document.getElementById(

            'cart-count'

        );

    const mobileBadge =

        document.getElementById(

            'cart-count-mobile'

        );

    if (desktopBadge) {

        desktopBadge.innerText =

            CartService.getTotalItems();

    }

    if (mobileBadge) {

        mobileBadge.innerText =

            CartService.getTotalItems();

    }

    alert(
        name +
        ' added to cart.'
    );
}



/*
==================================================
MOBILE DRAWER
==================================================
*/

function toggleMobileMenu() {

    const drawer =

        document.getElementById(

            'mobile-drawer'

        );

    const overlay =

        document.getElementById(

            'mobile-overlay'

        );

    drawer.classList.toggle(

        'active'

    );

    overlay.classList.toggle(

        'active'

    );

}


/*
--------------------------------------
Close Drawer
--------------------------------------
*/

function closeMobileMenu() {

    document

        .getElementById(

            'mobile-drawer'

        )

        .classList.remove(

            'active'

        );

    document

        .getElementById(

            'mobile-overlay'

        )

        .classList.remove(

            'active'

        );

}


/*
--------------------------------------
After Vue finishes rendering
--------------------------------------
*/

window.onload = function () {

    const overlay =

        document.getElementById(

            'mobile-overlay'

        );

    overlay.onclick =

        closeMobileMenu;

}



/*
Close menu when clicking outside
*/

document.addEventListener(

    'DOMContentLoaded',

    function () {

        const overlay =

            document.getElementById(

                'mobile-overlay'

            );

        if (!overlay) return;

        overlay.addEventListener(

            'click',

            function () {

                document

                    .getElementById(

                        'mobile-drawer'

                    )

                    .classList.remove(

                        'active'

                    );

                overlay.classList.remove(

                    'active'

                );

            }

        );

    }

);