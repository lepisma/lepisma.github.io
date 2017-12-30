module Jekyll
  class ImageCaptionBlock < Liquid::Block

    def initialize(tag_name, options, tokens)
      @options = options.split " "
      super
    end

    def render(context)
      # First line (divided by two line breaks) is image url
      # Second is caption
      # Passing zoom as option enables zoom
      contents = super
      lines = contents.split("\n\n").select { |l| l.strip != "" }

      img_url = lines[0].strip
      if @options.include? "zoom"
        img = "<img class='zoomTarget' data-closeclick='true' src='#{img_url}'>"
      else
        img = "<img src='#{img_url}'>"
      end

      caption_text = lines[1..-1].join("\n\n")
      caption = "<figcaption markdown='1'>#{caption_text}</figcaption>"
      "<figure>#{img}#{caption}</figure>"
    end
  end
end

Liquid::Template.register_tag('image_caption', Jekyll::ImageCaptionBlock)
