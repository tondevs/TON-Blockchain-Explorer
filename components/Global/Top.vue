<template>
  <header class="header-area">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <nav class="main-nav">
            <!-- ***** Logo Start ***** -->
            <nuxt-link :to="localePath('/')" class="logo mt-0">
<!--              <img src="~assets/images/logos/transparent-logo-dark.svg" class="light-logo" alt="Arda ICO"/>-->
<!--              <img src="~assets/images/logos/white-logo-dark.svg" class="dark-logo" alt="Arda ICO"/>-->
              <div class="light-logo mt-0"><nuxt-link class="h3 text-white" :to="localePath('/')"><img src="../../assets/images/logos/logo.png" alt="TON LOGO"><span class="text"><b>TON</b>EXPLORER</span></nuxt-link></div>
              <div class="dark-logo mt-0"><nuxt-link class="h3 text-dark" :to="localePath('/')"><img src="../../assets/images/logos/logo.png" alt="TON LOGO"><span class="text"><b>TON</b>EXPLORER</span></nuxt-link></div>
            </nuxt-link>
            <!-- ***** Logo End ***** -->

            <!-- ***** Lang Start ***** -->
            <div class="lang">
              <div class="selected">
                <img v-if="$i18n.locale === 'en'" src="~assets/images/flags/en.png" alt="">
                <img v-if="$i18n.locale === 'ko'" src="~assets/images/flags/ko.png" alt="">
                <i class="fa fa-angle-down"></i>
              </div>
              <ul class="flag-list">
                <li>
                  <nuxt-link :to="switchLocalePath('en')">
                    <img src="~assets/images/flags/en.png" alt=""><span>EN</span>
                  </nuxt-link>
                </li>
                <li>
                  <nuxt-link :to="switchLocalePath('ko')">
                    <img src="~assets/images/flags/ko.png" alt=""><span>KO</span>
                  </nuxt-link>
                </li>
              </ul>
            </div>
            <!-- ***** Lang End ***** -->

            <!-- ***** Menu Start ***** -->
            <ul class="nav text-small">
              <li><nuxt-link :to="localePath('/')">HOME</nuxt-link></li>
              <li><nuxt-link :to="localePath('/latest-blocks')">BLOCKS</nuxt-link></li>
              <li><nuxt-link :to="localePath('/latest-transactions')">TRANSACTIONS</nuxt-link></li>
              <li><nuxt-link :to="localePath('/latest-messages')">MESSAGES</nuxt-link></li>
              <li><nuxt-link :to="localePath('/latest-accounts')">ACCOUNTS</nuxt-link></li>
              <li class="position-relative dropdown">
                <nuxt-link class="dropdown-toggle" :to="localePath('/latest-validators')">VALIDATORS</nuxt-link>
                <div class="dropdown-menu" :class="{'show': dropdown}" aria-labelledby="navbarDropdown">
                  <nuxt-link class="dropdown-item" :to="localePath('/latest-validators')">VALIDATORS</nuxt-link>
                  <nuxt-link class="dropdown-item" :to="localePath('/leaderboard')">LEADERBOARD</nuxt-link>
                  <nuxt-link class="dropdown-item" :to="localePath('/dashboard')">DASHBOARD</nuxt-link>
                </div>
              </li>
<!--              <li><a href="dark-block-explorer-rich-list.html">RICH LIST</a></li>-->
<!--              <li><a href="#" class="btn-nav-box">SIGN UP</a></li>-->
            </ul>
            <a class='menu-trigger'>
              <span>Menu</span>
            </a>
            <!-- ***** Menu End ***** -->
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'top',
  data: () => {
    return {
      dropdown: false,
    }
  },
  mounted() {
    $(window).scroll(function () {
      var width = $(window).width();
      if (width > 991) {
        var scroll = $(window).scrollTop();
        if (scroll >= 30) {
          $(".header-area").addClass("header-sticky");
          $(".header-area .dark-logo").css('display', 'flex');
          $(".header-area .light-logo").css('display', 'none');
        } else {
          $(".header-area").removeClass("header-sticky");
          $(".header-area .dark-logo").css('display', 'none');
          $(".header-area .light-logo").css('display', 'flex');
        }
      }
    });

    if($('.menu-trigger').length){
      $('.menu-trigger').on('click', function(){
        $(this).toggleClass('active');
        $('.header-area .nav').slideToggle(200);
      });
    }

    $('body').on('click', function(e){
      var el = e.target;

      if($(el).parents('.flag-list').length || $(el).hasClass('flag-list')) return;

      if($('.flag-list').css('display') === 'block') {
        $('.flag-list').css('display', 'none');
        return;
      }

      if( $(el).hasClass('selected') || $(el).parents('.selected').length) {
        $('.flag-list').css('display', 'block');
      }
    });
  },
  methods: {
    toggleDropdown() {
      this.dropdown === true ? this.dropdown = false : this.dropdown = true;
      console.log(this.dropdown);
    }
  }
}
</script>

<style lang="scss" scoped>

  .dropdown:hover {
    .dropdown-menu {
      display: block;
    }
  }

  .dropdown-menu {
    margin: 0;
    padding: 0;
    border-radius: 0;
    background-color: #3B566E;

    a {
      color: white !important;
      transition: padding-right 250ms;
      height: auto !important;

      &:hover {
        background-color: unset;
        padding-left: 2rem;
      }
    }
  }

  .logo {
    padding: 1rem 0;
    color: inherit;
    font-size: inherit;
    display: flex;
    align-items: center;

    @media (max-width: 991.98px) {
      padding: 0;

      .text {
        display: none;
      }

      img {
        width: 60px !important;
      }
    }

    img {
      margin-right: 1rem;
      margin-top: -10px;
      width: 65px;
    }

    .dark-logo {
      color: #343a40 !important;
    }

    .light-logo {
      margin-top: .5rem !important;
      color: white !important;
    }
  }
</style>
