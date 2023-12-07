var $ = jQuery.noConflict();
$(document).ready(function () {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
        window.history.pushState(null, "", window.location.href);
    };
});



function ChangeBreadCrumb(menuHeading,mainMenu,menuLabel) {
    $("#headingcurrMenu").html(menuHeading);
    $("#lblmainMenu").html(mainMenu);
    $("#lblcurrMenu").html(menuLabel);
}




//$(function () {
//    $(".gridviewTable").DataTable(
//        {
////            "destroy": "true",
////            "language": { "emptyTale": "No Data Found" },
//////            fixedColumn: { leftColumns: 3 },
////            "scrollY": "300",
////            "scrollX": "true",
////            "ColumnDefs": [{
////                "width": "300",
////                "target": "0"
////            }]
//            destroy: true,
//            "language": {
//                "emptyTable": "No Data Found"
//            },
//            "fixedColumns": {
//                "leftColumns": "3"
//            },
//            "scrollY": "300",
//            "scrollX": "true",
//            "bFilter": false,
//            "bInfo": false,
//            "ColumnDefs": [{
//                "width": 300,
//                "target": 0
//            }]
//            , bLengthChange: true,
//            lengthMenu: [[5, 10, -1], [5, 10, "All"]],
//            bFilter: true,
//            bSort: true,
//            bPaginate: true

//        });
//    });




