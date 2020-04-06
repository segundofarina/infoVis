var rawdata = [{"topping":"Mushrooms","total":65,"male":63,"female":68},
{"topping":"Onion","total":62,"male":62,"female":63},
{"topping":"Ham","total":61,"male":66,"female":56},
{"topping":"Peppers","total":60,"male":63,"female":57},
{"topping":"Chicken","total":56,"male":60,"female":52},
{"topping":"Pepperoni","total":56,"male":66,"female":46},
{"topping":"Tomato","total":51,"male":49,"female":54},
{"topping":"Bacon","total":49,"male":56,"female":43},
{"topping":"Pineapple","total":42,"male":40,"female":44},
{"topping":"Sweetcorn","total":42,"male":38,"female":46},
{"topping":"Beef","total":36,"male":47,"female":26},
{"topping":"Olives","total":33,"male":33,"female":32},
{"topping":"Chillies","total":31,"male":42,"female":22},
{"topping":"Jalapenos","total":30,"male":39,"female":21},
{"topping":"Spinach","total":26,"male":20,"female":32},
{"topping":"Pork","total":25,"male":34,"female":17},
{"topping":"Tuna","total":22,"male":23,"female":21},
{"topping":"Anchovies","total":18,"male":21,"female":15},
{"topping":"Something else","total":11,"male":12,"female":10}]; 


const data = rawdata.map( (data, index) => ({...data, positon: index}));

const textMargin = 25;

const cirlceSepationX = Math.min(Math.floor((window.innerWidth - textMargin )/80) , 15);
const cirlceSepationY = 30;

const maleRadius = 4;
const femaleRadius = 4;
const totalRadius = 5;

const marginLeft = 10;

const dataMargin = marginLeft + textMargin;


  var svg = d3.select("div#vis").append("svg").attr("width", cirlceSepationX * 100).attr("height", cirlceSepationY * (data.length+1));


  svg.selectAll("text").data(data, ({topping}) => topping)
  .enter()
  .append("text")
  .attr("class","yAXis")
  .attr("x", marginLeft)
  .attr("y", (data, index) => (index+1) * cirlceSepationY +5)
  .text(({topping}) => topping)
  .attr("class", ({male, female}) => {
    if(male == female) return 'total';
    if(male > female) return "male";
    return 'female';
  })
  
  const updateText = (_data) => {
    const u = svg.selectAll("text").data(_data, ({topping}) => topping);

    u.enter()
    .append("text")
    .merge(u)
    .transition()
    .duration(2000)
    .attr("class","yAXis")
    .attr("x", marginLeft)
    .attr("y", (data, index) => (index+1) * cirlceSepationY +5)
    .text(({topping}) => topping)
    .attr("class", ({male, female}) => {
      if(male == female) return 'total';
      if(male > female) return "male";
      return 'female';
    })
  }


  const updateMaleCircles = (_data, duration) => updateDots(_data, duration, ({topping}) => topping, ({male}) => male, "male");

  const updateFemaleCircles = (_data, duration) => updateDots(_data, duration,  ({topping}) => topping, ({female}) => female, "female");

  const updateTotalCircles = (_data, duration) => updateDots(_data, duration, ({topping}) => topping, ({total}) => total, "total");

  const updateDots = (_data, duration = 2000, idFunction, valueFunction, className) => {
    const u = svg.selectAll(`circle.${className}`).data(_data, idFunction);
    u.enter()
    .append("circle")
    .merge(u)
    .transition()
    .duration(duration)
    .attr("class", className)
    .attr("cx", (data, index) => dataMargin + cirlceSepationX * valueFunction(data))
    .attr("cy", (data, index) => cirlceSepationY * (index+1))
    .attr("r", maleRadius);

    u.exit().remove();
  }

  const updateMaleLines = (_data, duration) => updateLines(_data, duration, ({topping}) => topping, ({male}) => male, ({total}) => total, "male");

  const updateFemaleLines = (_data, duration) => updateLines(_data, duration, ({topping}) => topping, ({female}) => female, ({total}) => total,  "female");

  const updateLines = (_data ,duration = 2000,  idFunction, x1Function, x2Function, className) => {
    const u = svg.selectAll(`line.${className}`).data(_data, idFunction);
    
    u.enter()
    .append('line')
    .merge(u)
    .transition()
    .duration(duration)
    .attr("class", className)
    .attr("x1", (data, index) => dataMargin + cirlceSepationX * x1Function(data))
    .attr("y1", (data, index) => cirlceSepationY * (index+1))
    .attr("x2", (data, index) => dataMargin + cirlceSepationX * x2Function(data))
    .attr("y2", (data, index) => cirlceSepationY * (index+1));

    u.exit().remove();
  }


  var btnAll = document.getElementById("allButton");
  btnAll.addEventListener('click',() => {
    onAllClick();
  });
  var btnMale = document.getElementById("maleButton");
  btnMale.addEventListener('click',() => {
    onMaleClick();
  });

  var btnFemale = document.getElementById("femaleButton");
  btnFemale.addEventListener('click',() => {
    onFemaleClick();
  });



  updateTotalCircles(data.map((data) => ({...data,total: 10})));
  setTimeout(() => {
    const _data = data.map(data => ({...data, male: data.total, female: data.total}))
    updateMaleCircles(_data);
    updateFemaleCircles(_data);
    updateTotalCircles(_data);
    updateMaleLines(_data);
    updateFemaleLines(_data);
  }, 2600);

  setTimeout(() => {
    const _data = data;
    updateAll(_data);
  }, 4600);

    const updateAll = (_data) => {
      updateMaleCircles(_data);
      updateFemaleCircles(_data);
      updateTotalCircles(_data);
      updateMaleLines(_data);
      updateFemaleLines(_data);
      updateText(_data);
    }
    const onMaleClick = () => {
      const _data = data.map(data => ({...data, total: data.male, female: data.male}));
      updateAll(_data);
      const ordered = _data.sort((a,b) => b.male - a.male);
      setTimeout(() => {
        updateAll(ordered);
        updateFemaleCircles([]);
      }, 2000);
    }

    const onFemaleClick = () => {
      const _data = data.map(data => ({...data, male: data.female, total: data.female}));
      updateAll(_data);
      const ordered = _data.sort((a,b) => b.female - a.female);
      setTimeout(() => {
        updateAll(ordered);
      }, 2000);
    }
    const onAllClick = () => {
      const _data = data;
      updateAll(_data);
    }

