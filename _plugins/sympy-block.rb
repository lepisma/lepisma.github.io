require 'tempfile'
require 'katex'

module Jekyll
  class SympyBlock < Liquid::Block
    def initialize(tag_name, markup, tokens)
      @tag = markup
      super
    end

    def render(context)
      contents = super
      Tempfile.open('sympy') do |tmp|
        lines = contents.split("\n").map do |line|
          if line.start_with? ":"
            # This is symbol declaration
            symbols = line[2..-1]
            "#{symbols} = symbols('#{symbols}')"
          elsif line.start_with? ">>"
            # This is a latex print statement
            "print(latex(#{line[3..-1]}))"
          else
            line
          end
        end
        lines.unshift('init_printing()')
        lines.unshift('from sympy import *')
        tmp.write(lines.join("\n"))

        output = `python -c "#{lines.join("\n")}"`
        Katex.render output
      end
    end

  end
end


Liquid::Template.register_tag('sympy', Jekyll::SympyBlock)
