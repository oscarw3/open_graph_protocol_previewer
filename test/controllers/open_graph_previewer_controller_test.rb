require 'test_helper'

class OpenGraphPreviewerControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get open_graph_previewer_index_url
    assert_response :success
  end

end
