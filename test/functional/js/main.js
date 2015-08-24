(function() {
  'use strict';

  //----------------------------------------------------------------
  // Initalize Rose
  //----------------------------------------------------------------
  var container = document.createElement('div');
  var tabGroup = document.createElement('ul');
  var tabContents = document.createElement('div');

  container.id = 'container';

  tabGroup.classList.add('tab-group');
  tabGroup.addEventListener('click', function(event) {
    if (event.target.tagName === 'LI') {
      var target = event.target.getAttribute('contents');
      var curActive = tabContents.querySelector('.active');
      if (curActive && curActive.id !== target) {
        tabGroup.querySelector('.active').classList.remove('active');
        curActive.classList.remove('active');
      }
      event.target.classList.add('active');
      tabContents.querySelector('#' + target).classList.add('active');
    }
  });

  tabContents.classList.add('tab-contents');

  container.appendChild(tabGroup);
  container.appendChild(tabContents);
  document.body.appendChild(container);

  /**
   * Rose Tabs
   *
   * Rose is primarily used for Functional testing in a way that it only adds
   * buttons to the DOM, which would be used for manually testing the framework
   *
   * # Example:
   *
   * ```
   * Rose.createTab({
   * 		name: 'PLG-99',
   * 		buttons: [
   * 			{
   * 				name: 'getFramesRendered',
   * 				onClick: function() {
   * 					// Do something here
   * 				}
   * 			},
   * 			// Additional buttons
   * 		]
   * })
   * ```
   */
  window.Rose = {
    createTab: function(args) {
      this.name = args.name || 'New Tab';
      this.buttons = args.buttons instanceof Array ? args.buttons :  [];

      var id = Math.ceil(Math.random() * 10000);

      var tab = document.createElement('li');
      tab.textContent = this.name;
      tab.setAttribute('contents', this.name + String(id));
      tabGroup.appendChild(tab);

      var contents = document.createElement('div');
      contents.id = this.name + String(id);
      tabContents.appendChild(contents);

      var _b;
      for(var button of this.buttons) {
        _b = document.createElement('button');
        _b.textContent = button.name || 'Button';
        _b.addEventListener('click', button.onClick);
        contents.appendChild(_b);
      }

      var _output = document.createElement('div');
      _output.classList.add('out');
      contents.appendChild(_output);

      if (tabGroup.children.length === 1) {
        tab.classList.add('active');
        contents.classList.add('active');
      }
    },

    output: function(text) {
      var _output = tabContents.querySelector('.active').querySelector('.out');
      if (String(text).trim() !== '') {
        _output.classList.add('show');
      } else {
        _output.classList.remove('show');
      }
      _output.textContent = text;
    }
  };
})();
