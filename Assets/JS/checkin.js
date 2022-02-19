$(function(){
    // set current time as minimum for input type date

    let nowTime = new Date().toISOString().split("T")[0];
    $(".input-date").attr("min", nowTime)

    // check validity
    $("#form").submit(function(event) {
        event.preventDefault();
        
        $(".error").css("display", "none");
        $("#tbody").html("")
        
        // check form validation based on 
        let validation = true;
        $(".inputbox input").each(function() {
            if ($(this).val() == "") {
                validation = false;
                $(".error").text("some information are missed");
            }
        })

        if (validation == true) {
            let checkInDate = new Date($("#check-in-date").val());
            let checkOutDate = new Date($("#check-out-date").val());
            if (checkOutDate < checkInDate) {
                validation = false;
                $(".error").text("the departure date is before arrival date");
            }
        }

        // if ($(".inputbox input").val() == "") {
        //     console.log("khali")
        //     validation = false;
        // }
        // if (validation){
        //     let checkInDate = new Date($("#check-in-date").val());
        //     let checkOutDate = new Date($("#check-out-date").val());
        //     if (checkOutDate < checkInDate) {
        //         console.log("bozorg")
        //         validation = false;
        //     }
        // }
        if (validation==true) {
            requestToFile()
        } else {
            $(".error").css("display", "block");
        }
    });

    // modal generation based on json file
    function requestToFile() {
        $(".error").css("display", "none");
        let roomNumber = Number($("#room-number").val());
        let checkInDate = new Date($("#check-in-date").val());
        let checkOutDate = new Date($("#check-out-date").val());

        // modal show
        $("#modal").addClass("show");

        // make table
        $.ajax({
            method: "GET",
            url: "http://127.0.0.1:5500/Assets/JSON/rooms.json",
            success: (result) => {
                let className = "not-available"
                result.forEach(opt => {
                    tempDatefrom = new Date(opt.from)
                    tempDateTo = new Date(opt.to)
                    
                    if (tempDatefrom <= checkInDate && tempDateTo >= checkOutDate && roomNumber == opt.bed) {
                        console.log("available" + opt.room)
                        className = "available";
                    }
                    temp = `<tr class=${className}><td>${opt.room}</td><td>${opt.from}</td><td>${opt.to}</td><td>${opt.bed}</td></tr>`;
                    $("#tbody").append(temp)
                    className = "not-available"
                });
            }
        }); 
    }

    // modal handling
    $("#close").click(function() {
        $("#modal").removeClass("show");
    });

    $(window).click(function() {
        $("#modal").removeClass("show");
    });
      
    $('.modal.modal-content').click(function(event){
        event.stopPropagation();
    });

});