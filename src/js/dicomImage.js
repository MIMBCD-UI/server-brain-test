var element = $('#dicomImage').get(0);
var currentImage = 1;
var imageId = 'example://' + currentImage;

$(document).ready(function() {
    var element = $('#dicomImage').get(0);

    var config = {
        maxWebWorkers: navigator.hardwareConcurrency || 1,
        startWebWorkersOnDemand: true,
        webWorkerPath : '/js/cornerstoneWADOImageLoaderWebWorker.js',
        taskConfiguration: {
            'decodeTask' : {
                loadCodecsOnStartup : true,
                initializeCodecsOnStartup: false,
                codecsPath: '/js/cornerstoneWADOImageLoaderCodecs.js',
            }
        }
    };
    cornerstoneWADOImageLoader.webWorkerManager.initialize(config);

    cornerstone.enable(element);
    // http://server/study/{StudyInstanceUid}/image/{SOPInstanceUID}

    // StudyInstanceUID: 1.2.3
    // SOP InstanceUID #1: 1.2.3.1
    // SOP InstanceUID #2: 1.2.3.2
    // SOP InstanceUID #3: 1.2.3.3
    // SOP InstanceUID #4: 1.2.3.4

    // var imageIds = [
    //  'http://server/study/1.2.3/image/1.2.3.1',
    //  'http://server/study/1.2.3/image/1.2.3.2',
    //  'http://server/study/1.2.3/image/1.2.3.3',
    //  'http://server/study/1.2.3/image/1.2.3.4'
    // ];

    var imageIds = [
        'wadouri:https://cdn.rawgit.com/chafey/byozfwv/cb216551/sampleData/1.2.840.113619.2.30.1.1762295590.1623.978668950.160.dcm'
    ];
    
    // var imageIds = [
    //     'example://1'
    // ];
    
    var currentImageIndex = 0;
    // show image #1 initially
    function updateTheImage(imageIndex) {
        currentImageIndex = imageIndex;
        cornerstoneTools.toolStyle.setToolWidth(3);
        cornerstoneTools.toolColors.setToolColor("#ffcc33");
        cornerstoneTools.toolColors.setActiveColor("#0099ff");
        cornerstoneTools.toolColors.setFillColor("#0099ff");
        // image enable the dicomImage element
        cornerstone.enable(element);
        var promise = cornerstone.loadImage(imageIds[currentImageIndex]);
        promise.then(function(image) {
            cornerstone.displayImage(element, image);
            cornerstoneTools.mouseInput.enable(element);
            // Enable all tools we want to use with this element
            cornerstoneTools.freehand.activate(element, 1);
            activate("#activate");
            function activate(id)
            {
                $('a').removeClass('active');
                $(id).addClass('active');
            }
            // Tool button event handlers that set the new active tool
            $('#disable').click(function() {
                activate("#disable");
                cornerstoneTools.freehand.disable(element);
                return false;
            });
            $('#enable').click(function() {
                activate("#enable");
                cornerstoneTools.freehand.enable(element);
                return false;
            });
            $('#activate').click(function() {
                activate("#activate");
                cornerstoneTools.freehand.activate(element, 1);
                return false;
            });
            $('#deactivate').click(function() {
                activate("#deactivate");
                cornerstoneTools.freehand.deactivate(element, 1);
                return false;
            });
            $('#clearToolData').click(function() {
                var toolStateManager = cornerstoneTools.getElementToolStateManager(element);
                // Note that this only works on ImageId-specific tool state managers (for now)
                toolStateManager.clear(element)
                cornerstone.updateImage(element);
            });
        });

        console.log(promise);
    };

    updateTheImage(0);

});
