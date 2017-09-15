

(function(){


}());





$('input:checkbox').change( fnTest );

// Clicking the Generate Canvas Button should run submit(), pop up displays all checked boxes
$('#generate-canvas-button').click( submit);

    function fnTest(e) {
        // Set all child checkboxes to the same value
        $(this).prop('checked', $(this).prop('checked')).val();
    };


    function submit(check) {
        alert("This js loaded ");

        console.log("Calling the submit for checkboxes");

/*        var checked = [];
        var targetGroupActors = [];
        var bigPictureActors = [];
        var bigPictureImpacts = [];
        var productDetailsActors = [];
        var productDetailsImpacts = [];
        var productDetailsDeliverable = [];

        $('input:checkbox:checked').each(function() {



            var name = $(this).attr('name');

            impactMapValues = $( this ).prop('id');
            impactMapActor = $( this ).prop('name');
            var value = document.getElementById(impactMapValues).value;

            if (impactMapActor == "actor-checkbox"){

                targetGroupActors.push(value);

            }

            if (impactMapActor == "impact-checkbox"){

                var result = value.split(",")

                actor_value = result[0]
                impact_value = result[1]
                bigPictureActors.push(actor_value)
                bigPictureImpacts.push(impact_value)

            }

            if (impactMapActor == "deliverable-checkbox"){

                var result = value.split(",")


                actor_value = result[0]
                impact_value = result[1]
                deliverable_value = result[2]
                productDetailsActors.push(actor_value)
                productDetailsImpacts.push(impact_value)
                productDetailsDeliverable.push(deliverable_value)


            }


            checked.push(value);

        });
        /!*
         if (targetGroupActors.length > 0){
         addTotargetGroup(targetGroupActors);
         }

         if (bigPictureImpacts.length > 0){
         addToBigPicture(bigPictureActors,bigPictureImpacts );
         }

         if (productDetailsDeliverable.length > 0){
         addReleaseTarget(productDetailsActors,productDetailsDeliverable);
         }*!/


        if (targetGroupActors === undefined || targetGroupActors.length == 0) {
            JIRA.Messages.showErrorMsg(AJS.I18n.getText('canvas.actor.error'), {"timeout": 5});
            return;
        }

        addTotargetGroup(targetGroupActors);
        /!*updateGenerateCanvasActorStatus(targetGroupActors);*!/
        addToBigPicture(bigPictureActors,bigPictureImpacts );
        addReleaseTarget(productDetailsActors,productDetailsImpacts, productDetailsDeliverable);



        /!*
         url =    AJS.params.baseURL+"/secure/discovery/ProductCanvas.jspa?productName="+AJS.$('#hiddenproduct').val()
         $(location).attr('href', url)*!/
        //AJS.log("You have selected:\n\n - " + checked.join("\n - ") );
        /!*alert("You have selected:\n\n - " + checked.join("\n - ") );*!/*/
    }

