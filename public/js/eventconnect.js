
if(jQuery != null){
	(function($,window,undefined){
		$(function(){
			if($("#editbackgroundForm").length){
				$("#editbackgroundForm").submit(function(){
					var content = $("#innerEditor")[0].contentWindow.svgCanvas.svgCanvasToString();
					$("#background").val(content);
				});
			}

			if($("#editSeatForm").length){
				$("#innerEditor").on("load",function(){
					var innerDoc = $("#innerEditor").contents(),
						innerBackground = innerDoc.find("#background svg"),
						svgroot = innerDoc.find("#svgroot");

					if(innerBackground.length){
						svgroot.before(innerBackground);
						var ofs = svgroot.offset();
						innerBackground.css("left","961px").css("top","810px");
						innerBackground.css("position","absolute");
						innerDoc.find("#svgcanvas").css("background","none");
						svgroot.css("opacity","0.76");
						//innerBackground
					}
					innerDoc.find("#tools_shapelib_show,#tool_topath,#tool_make_link").hide();

				});
				if(window.editor){
					$("#innerEditor").trigger("load");
				}
				$("#editSeatForm").submit(function(){
					var content = $("#innerEditor")[0].contentWindow.svgCanvas.svgCanvasToString();
					$("#seat").val(content);
				});				
			}
		});
	})(jQuery,window);

}