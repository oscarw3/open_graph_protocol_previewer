require 'test_helper'

class OpenGraphPreviewerControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get open_graph_previewer_index_url
    assert_response(:success)
  end

  test "start_processing with no params should return 400" do
    post("/open_graph_previewer/start_processing")
    assert_response(400)
  end

  # would add more tests here, including adding tests for ActionCable
end
