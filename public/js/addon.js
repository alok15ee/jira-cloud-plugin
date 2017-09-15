/* add-on script */

$(function onReady() {


    function product_check_PostAjaxOptions (productName) {
        return {
            "cache": false,
            "contentType": 'application/json',
            "dataType": 'json',
            "data": productName,
            "processData": false,
            "type": 'GET'
        };
    }

    $('#share-discovery').click(function(){
        AP.require('request', function(request) {
            request({
                type: "GET",
                url: "/rest/api/2/project",
                success: function(response) {
                    response = JSON.parse(response);


/*                    for (var key in response){

                        var projectKey = response[key].key;
                        AP.require('request', function(request) {
                            request({
                                type: "GET",
                                url: "/rest/api/2/project/" + projectKey,
                                success: function(response) {
                                    response = JSON.parse(response);

                                    /!*console.log("Project Info:" + response)*!/
                                    for (var key in response){
                                        if(key == "roles"){

                                            for(var val in response[key]){
                                                if (val == "Discovery Team"){
                                                    console.log(response[key][val]);
                                                    var roleId  = response[key][val].substring(response[key][val].lastIndexOf('/')+1);
                                                    AP.require('request', function(request) {
                                                        request({
                                                            type: "GET",
                                                            url: "/rest/api/2/project/" + projectKey + '/role/' + roleId,
                                                            success: function(response) {
                                                                response = JSON.parse(response);

                                                                console.log("Role Info:" + response)
                                                                /!*for (var key in response){

                                                                }*!/

                                                            },
                                                            error: function(response) {



                                                            }


                                                        });

                                                    });

                                                }
                                            }
                                        }

                                    }

                                },
                                error: function(response) {



                                }


                            });

                        });
                    }*/

                },
                error: function(response) {



                }


            });

        });

    });

    var $projectPicker = $("#my-project-picker");

    var projectKey;
    $projectPicker.auiSelect2({

        ajax: {
            url: "/rest/api/2/project", // JIRA-relative URL to the REST end-point
            type: "GET",
            dataType: 'json',
            cache: true,
            // query parameters for the remote ajax call
            data:  function data(term) {
                return {
                    query: term/*
                     maxResults: 1000,
                     showAvatar: true*/
                };
            },

            // parse data from the server into form select2 expects
            results: function results(data) {


                var i, dataLength;
                var dataArray = [];
                dataArray = data;
                data = JSON.parse(dataArray);

                return {
                    results: data
                };
            },
            // select2 uses $.ajax as  adefault transport function so we have to override it
            // to use AP.request for cross-origin communication
            transport: function transport(params) {
                AP.request({
                    url: params.url,
                    headers: {
                        "Accept": "application/json"
                    },

                    data: params.data,
                    success: params.success,
                    error: params.error
                });
            }
        },

        // define how selected element should look like
        formatSelection: function formatSelection(project) {

            return /*avatarHtml + */Select2.util.escapeMarkup(project.name);
        },
        // define how single option should look like
        formatResult: function formatResult(project, container, query, escapeMarkup) {
            // format result string
            var resultText = project.name + " - (" + project.key + ")";

            var higlightedMatch = [];
            // we need this to disable html escaping by select2 as we are doing it on our own
            var noopEscapeMarkup = function noopEscapeMarkup(s) { return s; }
            // highlight matches of the query term using matcher provided by the select2 library
            Select2.util.markMatch(escapeMarkup(resultText), escapeMarkup(query.term), higlightedMatch, noopEscapeMarkup);
            // convert array to string
            higlightedMatch = higlightedMatch.join("");
            return higlightedMatch;
        },
        // define message showed when there are no matches
        formatNoMatches: function formatNoMatches(query) {
            return "No matches found";
        }
    });


    var $userPicker = $("#my-user-picker");

    $userPicker.auiSelect2({
        hasAvatar: true, // auiSelect2 speciffic option, adds styling needed to properly display avatars

        ajax: {
            url: "/rest/api/2/user/picker", // JIRA-relative URL to the REST end-point
            type: "GET",
            dataType: 'json',
            cache: true,
            // query parameters for the remote ajax call
            data: function data(term) {
                return {
                    query: term
                    /*maxResults: 1000,
                    showAvatar: true*/
                };
            },
            // parse data from the server into form select2 expects
            results: function results(data) {
                var i, dataLength;
                data = JSON.parse(data);



                return {
                    results: data.users

                };
            },
            // select2 uses $.ajax as  adefault transport function so we have to override it
            // to use AP.request for cross-origin communication
            transport: function transport(params) {
                AP.request({
                    url: params.url,
                    headers: {
                        "Accept": "application/json"
                    },
                    data: params.data,
                    success: params.success,
                    error: params.error
                });
            }
        },
        // specify id parameter of each user entity
        id: function id(user) {
            return user.key;
        },
        // define how selected element should look like
        formatSelection: function formatSelection(user) {
            return Select2.util.escapeMarkup(user.displayName);
        },
        // define how single option should look like
        formatResult: function formatResult(user, container, query, escapeMarkup) {
            // format result string
            var resultText = user.displayName + " - (" + user.name + ")";

            var higlightedMatch = [];
            // we need this to disable html escaping by select2 as we are doing it on our own
            var noopEscapeMarkup = function noopEscapeMarkup(s) { return s; }
            // highlight matches of the query term using matcher provided by the select2 library
            Select2.util.markMatch(escapeMarkup(resultText), escapeMarkup(query.term), higlightedMatch, noopEscapeMarkup);
            // convert array to string
            higlightedMatch = higlightedMatch.join("");

            return higlightedMatch;
        },
        // define message showed when there are no matches
        formatNoMatches: function formatNoMatches(query) {
            return "No matches found";
        }
    });

    var $userPicker = $("#my-user-picker-existing");

    $userPicker.auiSelect2({
        hasAvatar: true, // auiSelect2 speciffic option, adds styling needed to properly display avatars

        ajax: {
            url: "/rest/api/2/user/picker", // JIRA-relative URL to the REST end-point
            type: "GET",
            dataType: 'json',
            cache: true,
            // query parameters for the remote ajax call
            data: function data(term) {
                return {
                    query: term
                    /*maxResults: 1000,
                     showAvatar: true*/
                };
            },
            // parse data from the server into form select2 expects
            results: function results(data) {
                var i, dataLength;
                data = JSON.parse(data);



                return {
                    results: data.users

                };
            },
            // select2 uses $.ajax as  adefault transport function so we have to override it
            // to use AP.request for cross-origin communication
            transport: function transport(params) {
                AP.request({
                    url: params.url,
                    headers: {
                        "Accept": "application/json"
                    },
                    data: params.data,
                    success: params.success,
                    error: params.error
                });
            }
        },
        // specify id parameter of each user entity
        id: function id(user) {
            return user.key;
        },
        // define how selected element should look like
        formatSelection: function formatSelection(user) {
            return Select2.util.escapeMarkup(user.displayName);
        },
        // define how single option should look like
        formatResult: function formatResult(user, container, query, escapeMarkup) {
            // format result string
            var resultText = user.displayName + " - (" + user.name + ")";

            var higlightedMatch = [];
            // we need this to disable html escaping by select2 as we are doing it on our own
            var noopEscapeMarkup = function noopEscapeMarkup(s) { return s; }
            // highlight matches of the query term using matcher provided by the select2 library
            Select2.util.markMatch(escapeMarkup(resultText), escapeMarkup(query.term), higlightedMatch, noopEscapeMarkup);
            // convert array to string
            higlightedMatch = higlightedMatch.join("");

            return higlightedMatch;
        },
        // define message showed when there are no matches
        formatNoMatches: function formatNoMatches(query) {
            return "No matches found";
        }
    });


/*

    var role={
        "name": "Product Owner",
        "description": "Product Owner to discover the product"
    };


    AP.require('request', function(request) {
        request({
            type: "POST",
            url: "/rest/api/2/role",
            dataType: "json",
            data: JSON.stringify(role),
            contentType: "application/json",
            success: function(response) {
                response = JSON.parse(response);

                console.log(response)

            },
            error: function(response) {



            }


        });

    });
*/

/*    function addActor(){


    }*/


});
