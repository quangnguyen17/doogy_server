
imagesCount = 0;
breed = ""
breeds = []
bannerUrls = []
quotes = []

function view(event) {
    absoluteURL = getAbsoluteURL($(event.target).parent().css('background-image'));

    var form = $(document.createElement('form'));
    $(form).attr("action", "/view");
    $(form).attr("method", "GET");
    $(form).css("display", "none");

    var input_employee_name = $("<input>").attr("type", "text").attr("name", "image_url").val(absoluteURL);
    $(form).append($(input_employee_name));

    form.appendTo(document.body);
    $(form).submit();
}

function like(event, callBack) {
    if (user_id.length < 1) {
        window.location.replace("/welcome");
    }

    button = $(event.target);
    imageURL = getAbsoluteURL(button.parent().parent().parent().parent().css('background-image'));

    $.ajax({
        type: "GET",
        url: `/like/${user_id}`,
        data: { 'image_url': imageURL },
        success: function (response) {
            button.attr('src', response);

            if (callBack) {
                callBack(response);
            }
        }
    });
}

function handleLike(button, imageURL, callBack) {
    if (user_id.length < 1) {
        window.location.replace("/welcome");
    }

    $.ajax({
        type: "GET",
        url: `/like/${user_id}`,
        data: { 'image_url': imageURL },
        success: function (response) {
            button.attr('src', response);

            if (callBack) {
                callBack(response);
            }
        }
    });
}

function getURL() {
    return (breed.length > 0) ? `https://dog.ceo/api/breed/${breed}/images/random/16` : `https://dog.ceo/api/breeds/image/random/16`;
}

function fetchImages() {
    $.ajax({
        type: "GET",
        url: getURL(),
        success: function (response) {
            for (const index in response.message) {
                fetchedImageURL = response.message[index];
                heartLikedImage = (liked_urls.includes(fetchedImageURL)) ? heartImageFilled : heartImage;
                code = `<div class="col-lg-3 col-md-6 col-sm-12 p-0 text-center">
                    <div class="image-box" @click.self="parent" style="background-image: url(${fetchedImageURL});">
                        <div class="text-box text-center text-light">
                            <div class="content-align-bottom text-center align-items-end">
                                <button id="like" class="btn like-section p-0 mt-auto"><img class="p-0" id="heart" src="${heartLikedImage}" alt=""></button>
                                <div class="buttons d-inline-block text-right">
                                    <a id="view-raw" class="btn btn-sm btn-outline-light rounded-0 d-inline-block" href="${fetchedImageURL}" target="_blank">View Raw</a><br>
                                    <a id="download" class="btn btn-sm btn-outline-light rounded-0 d-inline-block mt-1" href="${fetchedImageURL}" download>Download</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;

                imagesCount++;
                $('.second-row').append(code);
            }

            $('.second-row #like').on('click', function (event) {
                stopBubbling(event);
                like(event);
            });

            $('.second-row .image-box').on('click', function (event) {
                if (event.target.id === "download" || event.target.id === "view-raw") {
                    stopBubbling(event);
                } else {
                    view(event);
                }
            });

            localizedBreed = (breed.length < 1) ? 'random' : `keyword '${breed}'`;
            $('#images-count-txt').text(`(About ${imagesCount} results are shown for ${localizedBreed}.)`);
        }
    });
}

function stopBubbling(event) {
    event.stopPropagation();
    event.cancelBubble = true;
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
    if (darkMode) {
        $('body').css('background-color', 'rgb(10, 10, 10)');
        $('nav').addClass('bg-dark navbar-dark');
        $('nav #search-bar').addClass('bg-dark text-light');
        $('#favorites, #collection').addClass('btn-dark');
        $('nav h3, nav p').css('color', 'white');
        $('footer').addClass('bg-dark');
        $('footer h4').addClass('text-light');
        $('.first-row .list-inline').addClass('text-light');
        $('#more-doogy').addClass('btn-dark');
        $('.breed-btn').addClass('btn-dark');
        $('#show-breed').addClass('text-light');
        $('select').addClass('bg-dark text-light');
        $('.btn-color').addClass('btn-dark');
        $('.jumbotron').addClass('bg-dark');
        $('.jumbotron h3, h3').addClass('text-light');
        $('#heart-img').css('filter', 'invert(100%)');
        $('li p').addClass('text-light');
    } else {
        $('body').css('background-color', 'white');
        $('nav').removeClass('bg-dark navbar-dark');
        $('nav #search-bar').removeClass('bg-dark text-light');
        $('#favorites, #collection').removeClass('btn-dark');
        $('nav h3, nav p').css('color', 'black');
        $('footer').removeClass('bg-dark');
        $('footer h4').removeClass('text-light');
        $('.first-row .list-inline').removeClass('text-light');
        $('#more-doogy').removeClass('btn-dark');
        $('.breed-btn').removeClass('btn-dark');
        $('#show-breed').removeClass('text-light');
        $('select').removeClass('bg-dark text-light');
        $('.btn-color').removeClass('btn-dark');
        $('.jumbotron').removeClass('bg-dark');
        $('.jumbotron h3, h3').removeClass('text-light');
        $('#heart-img').css('filter', 'invert(0%)');
        $('li p').removeClass('text-light');
    }
}

function activateDarkMode() {
    $('#light-mode').click(function () {
        $(this).addClass('active');
        $('#dark-mode').removeClass('active');
        applyDark(true);
    });

    $('#dark-mode').click(function () {
        $(this).addClass('active');
        $('#light-mode').removeClass('active');
        applyDark(false);
    });
}

function applyDark(darkEnabled) {
    $.ajax({
        type: "GET",
        url: "/update_dark_mode",
        data: { 'dark': darkEnabled },
        success: function (response) {
            updateUI(darkEnabled);
        }
    });
}

function getAbsoluteURL(url) {
    start = 0;
    URL = "";

    for (const index in url) {
        if (url[index] === `"`) {
            start = (start > 0) ? 0 : 1
        } else {
            if (start > 0) {
                URL += url[index];
            }
        }
    }

    return URL;
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
                imagesCount = 0;
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
    activateDarkMode();
    fetchImages();
    getCarouselImages();
    getBreeds();
});