module Jekyll
  class FigureDivBlock < Liquid::Block

    def initialize(tag_name, div_id, tokens)
      @div_id = div_id.strip
      super
    end

    def render(context)
      contents = super
      caption = "<figcaption markdown='1'>#{contents}</figcaption>"
      "<figure><div id='#{@div_id}'></div>#{caption}</figure>"
    end
  end
end

Liquid::Template.register_tag('figure_div', Jekyll::FigureDivBlock)
