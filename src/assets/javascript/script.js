(function(){

	$('.main-carousel').flickity({
	  // options
	  cellAlign: 'center',
	  contain: true,
	  groupCells: true,
	  pageDots: false
	});

	$('.detail-carousel').flickity({
	  // options
	  cellAlign: 'center',
	  contain: true,
	  groupCells: true,
	  pageDots: false,
	  prevNextButtons: false
	});

	$('.custom-carousel').flickity({
	  // options
	  cellAlign: 'center',
	  contain: true,
	  groupCells: true,
	  pageDots: false
	});

	$('.groups-wrapper ul li').on('click', function(){

		$(this).toggleClass('on');
		$(this).find('.expanse').toggleClass('on');

	});

	$('.expanse').on('click', function(){

		$(this).parents('li').toggleClass('on');
		$(this).toggleClass('on');

	});

	$('.main-carousel .carousel-cell').on('click', function(){

		$('.main-carousel .carousel-cell').removeClass('active');
		$(this).addClass('active');

	});

	$('div.playlist-header').on('click', function(e){
		e.stopPropagation();

		$(this).parents('li').toggleClass('on');

	});

	// Menu

	$('.menu-wrapper').on('click', function(){

		//$(this).addClass('on');
		$(this).toggleClass('on');

	});

	// Create
	$('.information-wrapper .header').on('click', function(){
		$('.information-wrapper').toggleClass('on');
		$(this).toggleClass('on');
	});

	// Order
	$('.order-wrapper .header').on('click', function(){
		$('.order-wrapper').toggleClass('on');
		$(this).toggleClass('on');
	});

	// Add
	$('.add-wrapper .header').on('click', function(){
		$('.add-wrapper').toggleClass('on');
		$(this).toggleClass('on');
	});

	// Video
	$('.video-wrapper .header').on('click', function(){
		$('.video-wrapper').toggleClass('on');
		$(this).toggleClass('on');
	});

	// Video
	$('.assignment-wrapper').on('click', function(e){
		e.stopPropagation();
		
		$(this).toggleClass('on');
	});



	// Posicion Custom Slider BackList
	var altura = $('.custom-carousel .carousel-cell ul');

	if (altura.length) {
	  var custom = altura.offset().top;
	  $('.custom-list').css({"top": custom});
	  $('.custom-carousel .carousel-cell > ul li').on('click', function(){

			$(this).toggleClass('off');

		});
	}

	$( "#sortable" ).sortable();
  $( "#sortable" ).disableSelection();

  $('ul.order-list').on('mouseup', function(){
		$('ul.order-list li').each(function( index ) {
		  $( this ).find('.index').text(index);
		});
	});
  

})();