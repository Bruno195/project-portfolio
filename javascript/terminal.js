(function () {
  var PROFILE = {
    name: 'Bruno Monteiro',
    role: 'Software Engineer',
    company: 'Sicredi',
    location: 'Paraná, Brazil',
    stack: [
      'Node.js / NestJS',
      'Python / FastAPI',
      'React / Next / Vue',
      'PostgreSQL / MongoDB',
      'RabbitMQ / MQTT'
    ],
    cloud: ['AWS · EC2 S3 SQS SNS', 'Jenkins CI/CD'],
    focus: [
      'Event-driven systems',
      'IoT telemetry',
      'Applied AI / LLMs'
    ],
    education: 'MBA — USP (2026)',
    status: 'building_real_systems'
  };

  function span(cls, text) {
    return '<span class="' + cls + '">' + text + '</span>';
  }

  function renderValue(value, indent) {
    var pad = '  '.repeat(indent);
    var nextPad = '  '.repeat(indent + 1);

    if (value === null) return span('ds-json-null', 'null');
    if (typeof value === 'boolean') return span('ds-json-boolean', String(value));
    if (typeof value === 'number') return span('ds-json-number', String(value));
    if (typeof value === 'string') return span('ds-json-string', '"' + value + '"');

    if (Array.isArray(value)) {
      if (!value.length) return span('ds-json-bracket', '[]');
      return span('ds-json-bracket', '[') + '\n' +
        value.map(function (item) {
          return nextPad + renderValue(item, indent + 1);
        }).join(span('ds-json-comma', ',') + '\n') + '\n' +
        pad + span('ds-json-bracket', ']');
    }

    return renderJSON(value, indent);
  }

  function renderJSON(obj, indent) {
    indent = indent || 0;
    var pad = '  '.repeat(indent);
    var nextPad = '  '.repeat(indent + 1);
    var keys = Object.keys(obj);
    var lines = [span('ds-json-brace', '{')];

    keys.forEach(function (key, index) {
      var comma = index === keys.length - 1 ? '' : span('ds-json-comma', ',');
      lines.push(
        nextPad +
        span('ds-json-key', '"' + key + '"') +
        span('ds-json-colon', ': ') +
        renderValue(obj[key], indent + 1) +
        comma
      );
    });

    lines.push(pad + span('ds-json-brace', '}'));
    return lines.join('\n');
  }

  function typewriterReveal(container, html, onComplete) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      container.innerHTML = html;
      if (onComplete) onComplete();
      return;
    }

    var position = 0;
    var delay = 18;

    function next() {
      if (position >= html.length) {
        container.innerHTML = html;
        if (onComplete) onComplete();
        return;
      }

      if (html[position] === '<') {
        while (position < html.length && html[position] !== '>') position++;
        position++;
        window.setTimeout(next, 0);
        return;
      }

      position++;
      container.innerHTML = html.slice(0, position);
      window.setTimeout(next, delay);
    }

    window.setTimeout(next, 400);
  }

  function initTerminal() {
    try {
      var output = document.getElementById('terminal-output');
      if (!output) return;

      var cursorLine = document.querySelector('.ds-terminal__line--cursor');
      if (cursorLine) cursorLine.style.opacity = '0';

      typewriterReveal(output, renderJSON(PROFILE, 0), function () {
        if (cursorLine) cursorLine.style.opacity = '1';
      });
    } catch (error) {
      console.warn('[terminal.js] render skipped:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTerminal);
  } else {
    initTerminal();
  }
})();
