function buildMetadata(sample) {
    // @TODO: Complete the following function that builds the metadata panel
    // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    let dataPanel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    dataPanel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    d3.json(`/metadata/${sample}`).then(sample_metadata => {
        const object = sample_metadata;
        for (let [key, value] of Object.entries(object)) {
            dataPanel
                .append("div")
                .text(`${key}: ${value}`)
        };
        // BONUS: Build the Gauge Chart
        // buildGauge(data.WFREQ);
        var data = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: object.WFREQ,
            title: { text: "Bellybutton wash frequency", font: { size: 24 } },
            type: "indicator",
            mode: "gauge+number+delta",
            delta: { reference: 8 },
            gauge: {
                axis: { range: [null, 9] },
                steps: [
                    { range: [0, 5], color: "lightgray" },
                    { range: [5, 9], color: "gray" }
                ],
                threshold: {
                    line: { color: "red", width: 4 },
                    thickness: 0.75,
                    value: 8.7
                }
            }
        }];

        var layout = {
            width: 500,
            height: 400,
            margin: { t: 0, b: 0 },
            font: { color: "darkblue", family: "Arial" }
        };
        Plotly.newPlot('gauge', data, layout);

    });
}

function buildCharts(sample) {
    // @TODO: Use `d3.json` to fetch the sample data for the plots
    d3.json(`/samples/${sample}`).then(data => {
        otus = data['otu_ids'];
        values = data['sample_values'];
        labels = data['otu_labels'];

        // @TODO: Build a Bubble Chart using the sample data
        var trace1 = {
            x: otus,
            y: values,
            text: labels,
            mode: 'markers',
            marker: {
                size: values,
                color: otus
            }
        };

        var dataBubble = [trace1];

        var layoutBubble = {
            showlegend: false
        };

        Plotly.newPlot('bubble', dataBubble, layoutBubble);

        // @TODO: Build a Pie Chart
        // HINT: You will need to use slice() to grab the top 10 sample_values,
        // otu_ids, and labels (10 each).
        pie_otus = otus.slice(0, 9);
        pie_values = values.slice(0, 9);
        pie_labels = labels.slice(0, 9);
        var data = [{
            values: pie_values,
            labels: pie_otus,
            type: 'pie'
        }];

        var layout = {
            height: 400,
            width: 500
        };

        Plotly.newPlot("pie", data, layout);

    });

}

function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Use the first sample from the list to build the initial plots
        const firstSample = sampleNames[0];
        buildMetadata(firstSample);
        buildCharts(firstSample);

    });
}

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);

}

// Initialize the dashboard
init();