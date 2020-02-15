
breed = ""
breeds = []
bannerUrls = []
quotes = []

function like(event) {
    if (user_id.length > 0) {
        imageURL = absoluteURL($(event.target).parent().parent().parent().parent().parent().css('background-image'));

        $.ajax({
            type: "GET",
            url: `/like/${user_id}`,
            data: { 'image_url': imageURL },
            success: function (response) {
                $(event.target).attr('src', response);
            }
        });
    } else {
        window.location.replace("/welcome");
    }
}

function getURL() {
    if (breed.length > 0) {
        return `https://dog.ceo/api/breed/${breed}/images/random/16`;
    }

    return `https://dog.ceo/api/breeds/image/random/16`;
}

function fetchImages() {
    $.ajax({
        type: "GET",
        url: getURL(),
        success: function (response) {
            for (const index in response.message) {
                imageURL = response.message[index];
                heartLikedImage = (liked_urls.includes(imageURL)) ? heartImageFilled : heartImage;
                code = `<div class="col-3 text-center">
                    <div class="image-box" style="background-image: url(${imageURL});">
                        <div class="text-box text-center text-light">
                            <div class="content-align-bottom text-center align-items-end">
                                <div class="like-section p-0 d-inline-block">
                                    <button id="like" class="btn p-0 mt-auto"><img class="p-0" id="heart" src="${heartLikedImage}" alt=""></button>
                                </div>
                                <div class="buttons d-inline-block">
                                    <a class="btn btn-sm btn-outline-light d-inline-block" href="${imageURL}" download>Download</a>
                                    <br>
                                    <a class="btn btn-sm btn-outline-light d-inline-block mt-2" href="${imageURL}" target="_blank">View Raw</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;

                $('.second-row').append(code);
            }

            $('.second-row #like').on('click', function (e) {
                like(e);
            });
        }
    });
}

function renderCarousel() {
    code = "";

    for (const index in bannerUrls) {
        active = (index > 0) ? "" : "active";
        data = bannerUrls[index];
        code += `<div class="carousel-item ${active} w-100">
            <img autoplay class="d-block w-100" src="${data.url}" alt="">
            <div class="gradient-layer"></div>
            <div class="carousel-caption d-none d-md-block">
                <h1 class="font-weight-bold">"${data.quote.quote}"</h1>
                <p class="mb-0">- ${data.quote.author} -</p>
            </div>
        </div>`;
    }

    $('.carousel-inner').html(code);
}

function updateUI(darkMode) {
    if (!darkMode) {
        $('body').css('background-color', 'rgb(10, 10, 10)');
        $('nav').addClass('bg-dark navbar-dark');
        $('#favorites, #collection').addClass('btn-dark');
        $('nav h3, nav p').css('color', 'white');
        $('footer').addClass('bg-dark');
        $('footer h4').addClass('text-light');
        $('h3').addClass('text-light');
        $('#more-doogy').addClass('btn-dark');
        $('.breed-btn').addClass('btn-dark');
        $('#show-breed').addClass('text-light');
        $('select').addClass('bg-dark text-light');
        $('.btn-color').addClass('btn-dark');
    } else {
        $('body').css('background-color', 'white');
        $('nav').removeClass('bg-dark navbar-dark');
        $('#favorites, #collection').removeClass('btn-dark');
        $('nav h3, nav p').css('color', 'black');
        $('footer').removeClass('bg-dark');
        $('footer h4').removeClass('text-light');
        $('h3').removeClass('text-light');
        $('#more-doogy').removeClass('btn-dark');
        $('.breed-btn').removeClass('btn-dark');
        $('#show-breed').removeClass('text-light');
        $('select').removeClass('bg-dark text-light');
        $('.btn-color').removeClass('btn-dark');
    }
}

function addDarkModeSupport() {
    $('#light-mode').click(function () {
        darkModeOn = false;
        $(this).addClass('active');
        $('#dark-mode').removeClass('active');
        updateUI(false);
    });

    $('#dark-mode').click(function () {
        darkModeOn = true;
        $(this).addClass('active');
        $('#light-mode').removeClass('active');
        updateUI(true);
    });
}

function absoluteURL(url) {
    start = 0;
    urlString = "";
    for (const index in url) {
        if (new String(url[index]).valueOf() == new String(`"`).valueOf()) {
            if (start > 0) {
                start = 0;
            } else {
                start = 1;
            }
        } else {
            if (start > 0) {
                urlString += url[index];
            }
        }
    }

    return urlString;
}

function getBreeds() {
    $.ajax({
        type: "GET",
        url: "https://dog.ceo/api/breeds/list/all",
        success: function (response) {
            Object.keys(response.message).forEach(function (key) {
                breeds.push(key);
                $('#select').append(`<option value="${key}">#${key}</option>`);
            });

            $('#select').change(function (e) {
                breed = e.target.value;
                $('#show-breed').text(`#${breed}`);
                breed = (new String(breed).valueOf() == new String("random").valueOf()) ? "" : `${breed}`;
                $('.second-row').html("");
                fetchImages();
            });
        }
    });
}

function getCarouselImages() {
    $.ajax({
        type: "GET",
        url: importedQuotes,
        success: function (response) {
            for (const index in response) {
                quotes.push(response[index]);
            }

            for (i = 0; i < 9; i++) {
                $.ajax({
                    type: "GET",
                    url: "https://random.dog/woof.json",
                    success: function (response) {
                        quote = quotes[Math.floor(Math.random() * quotes.length)];
                        object = { 'fileSize': response.fileSizeBytes, 'url': response.url, 'quote': quote };

                        if (fileExt(object.url) != 'mp4' && fileExt(object.url) != 'webm') {
                            bannerUrls.push(object);
                            renderCarousel();
                        }
                    }
                });
            }
        }
    });
}

function fileExt(str) {
    return str.split('.').pop().toLowerCase();
}

$(document).ready(function () {
    $('[data-toggle="popover"]').popover();
    addDarkModeSupport();
    fetchImages();
    getCarouselImages();
    getBreeds();
});